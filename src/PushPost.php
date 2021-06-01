<?php

namespace nicomartin\ProgressiveWordPress;

class PushPost
{
    private static $optionKey = 'pwp_pushpost_types';
    private static $sentMetaKey = 'pwp_pushpost_sent';

    public function run()
    {
        add_action('add_meta_boxes', [$this, 'metaBox']);
        add_action('rest_api_init', [$this, 'registerRoute']);
        add_filter('pwp_pushpost_title', [$this, 'filterDaraVars'], 10, 2);
        add_filter('pwp_pushpost_body', [$this, 'filterDaraVars'], 10, 2);
        add_filter('pwp_submenu_push', [$this, 'addSubmenuItem']);
        add_action('transition_post_status', [$this, 'autoPush'], 10, 3);
        add_action('pwp_on_push_sent', [$this, 'afterPushSent'], 10, 4);
    }

    public function metaBox()
    {
        foreach (self::getActivePostTypes() as $postType) {
            add_meta_box(
                'pwp-pushpost-meta-box',
                __('Push Notification', 'progressive-wp'),
                function ($post) use ($postType) {
                    $sent = self::isPushPostSent($post->ID) ? 'true' : 'false';
                    echo "<div class='pushpost-meta-container' id='pwp-pushpost' data-post-id='{$post->ID}' data-pushpost-sent='{$sent}'></div>";
                },
                $postType,
                'side'
            );
        }
    }

    public function registerRoute()
    {
        register_rest_route(pwpGetInstance()->api_namespace, 'push-post-types', [
            'methods'             => 'GET',
            'callback'            => [$this, 'apiGetPushPostTypes'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'push-post-types', [
            'methods'             => 'POST',
            'callback'            => [$this, 'apiSavePushPostTypes'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'push-post-data/(?P<postId>\S+)', [
            'methods'             => 'GET',
            'callback'            => function ($req) {
                $params = $req->get_params();

                return self::getData($params['postId']);
            },
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            },
            'args'                => [
                'postId'
            ],
        ]);
    }

    public function apiGetPushPostTypes()
    {
        return self::getPushPostTypesSettings();
    }

    public function apiSavePushPostTypes($req)
    {
        $params            = $req->get_params();
        $postTypesSettings = self::getPushPostTypesSettings();
        $data              = [];

        foreach ($postTypesSettings as $pt => $ptSavedData) {
            $ptData    = array_key_exists($pt, $params) ? $params[$pt] : [];
            $data[$pt] = [
                'active'   => array_key_exists('active', $ptData) ? $ptData['active'] : $ptSavedData['active'],
                'title'    => array_key_exists('title', $ptData) ? $ptData['title'] : $ptSavedData['title'],
                'body'     => array_key_exists('body', $ptData) ? $ptData['body'] : $ptSavedData['body'],
                'autoPush' => array_key_exists('autoPush', $ptData) ? $ptData['autoPush'] : $ptSavedData['autoPush'],
            ];
        }

        return ['saved' => update_option(self::$optionKey, $data)];
    }

    public function filterDaraVars($string, $post)
    {
        $string = str_replace('{post_title}', get_the_title($post), $string);

        return $string;
    }

    public function addSubmenuItem($items)
    {
        $items['pushpost'] = __('Push Post', 'progressive-wp');

        return $items;
    }

    public function autoPush($new_status, $old_status, $post)
    {
        if (in_array($post->post_type, self::getActiveAutoPushPostTypes()) &&
            (($old_status != 'publish') && ($new_status == 'publish'))
        ) {
            $data = self::getData($post->ID);
            PushNotifications::sendPush($data['title'], $data['body'], $data['url'], $data['imageId'], null, $post->ID);
        }
    }

    public function afterPushSent($sent, $data, $receiver, $postId)
    {
        if ($postId !== 0) {
            update_post_meta($postId, self::$sentMetaKey, 'true');
        }
    }

    /**
     * Helpers
     */

    private static function getData($postId)
    {
        $post              = get_post($postId);
        $savedData         = self::getPushPostTypesSettings();
        $savedPostTypeData = array_key_exists($post->post_type, $savedData) ? $savedData[$post->post_type] : [];

        return [
            'title'   => apply_filters(
                'pwp_pushpost_title',
                array_key_exists('title', $savedPostTypeData) ? $savedPostTypeData['title'] : '{post_type}',
                $post
            ),
            'body'    => apply_filters(
                'pwp_pushpost_body',
                array_key_exists('body', $savedPostTypeData) ?
                    $savedPostTypeData['body'] :
                    sprintf(__('New %s published!', 'progressive-wp'), 'Post'),
                $post
            ),
            'url'     => get_permalink($post),
            'imageId' => get_post_thumbnail_id($post)
        ];
    }

    private static function getPostTypes()
    {
        $postTypesBuiltin = get_post_types([
            'public'   => true,
            'show_ui'  => true,
            '_builtin' => true,
        ]);

        $postTypes = get_post_types([
            'public'   => true,
            'show_ui'  => true,
            '_builtin' => false,
        ]);

        $postTypes = array_merge($postTypesBuiltin, $postTypes);
        unset($postTypes['attachment']);

        return $postTypes;
    }

    private static function getActivePostTypes()
    {
        $data = get_option(self::$optionKey, []);

        return array_keys(array_filter($data, function ($postType) {
            return array_key_exists('active', $postType) && $postType['active'] === true;
        }));
    }

    private static function getActiveAutoPushPostTypes()
    {
        $data = get_option(self::$optionKey, []);

        return array_keys(array_filter($data, function ($postType) {
            return array_key_exists('autoPush', $postType) && $postType['autoPush'] === true;
        }));
    }

    private static function getPushPostTypesSettings()
    {
        $postTypes = self::getPostTypes();
        $data      = [];
        $savedData = get_option(self::$optionKey, []);

        foreach ($postTypes as $pt) {
            $obj       = get_post_type_object($pt);
            $saved     = array_key_exists($pt, $savedData) ? $savedData[$pt] : [];
            $data[$pt] = [
                'postType' => $pt,
                'name'     => $obj->labels->name,
                'active'   => array_key_exists('active', $saved) ? $saved['active'] : false,
                'title'    => array_key_exists('title', $saved) ? $saved['title'] : '{post_title}',
                'body'     => array_key_exists('body', $saved) ?
                    $saved['body'] : sprintf(__('New %s published!', 'progressive-wp'), $obj->labels->singular_name),
                'autoPush' => array_key_exists('autoPush', $saved) ? $saved['autoPush'] : false,
            ];
        }

        return $data;
    }

    private static function isPushPostSent($postId)
    {
        $meta = get_post_meta($postId, self::$sentMetaKey, true);

        return $meta === true;
    }
}
