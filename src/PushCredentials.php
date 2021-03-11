<?php

namespace nicomartin\ProgressiveWordPress;

use Minishlink\WebPush\VAPID;

class PushCredentials
{

    public static $vapid_option = 'pwp_vapid-credentials';
    public static $subject_key = 'vapid-subject';
    public static $emptyVapid = [
        'publicKey'  => '',
        'privateKey' => '',
        'subject'    => '',
    ];

    public function run()
    {
        add_action('rest_api_init', [$this, 'registerRoute']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);

        add_action('admin_action_pwp_reset_vapid', [$this, 'resetVapid']);
    }

    public function registerRoute()
    {
        register_rest_route(pwpGetInstance()->api_namespace, 'vapid', [
            'methods'             => 'PUT',
            'callback'            => [$this, 'apiSetVapid'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'vapid', [
            'methods'             => 'DELETE',
            'callback'            => [$this, 'apiDeleteVapid'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'vapid', [
            'methods'             => 'GET',
            'callback'            => [$this, 'apiGetVapid'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);
    }

    public function footerJs($values)
    {
        $values['vapid'] = self::getVapid();

        return $values;
    }

    public function apiSetVapid()
    {
        $vapid = self::getVapid();
        if ($vapid['publicKey'] !== '' || $vapid['privateKey'] !== '') {
            return new \WP_Error('vapid_already_set', __('VAPID already set', 'progressive-wp'), [
                'status' => 400,
            ]);
        }

        $generated = self::regenerateVapid();
        if ($generated) {
            return self::getVapid();
        } else {
            return new \WP_Error('vapid_failed', __('VAPID keypair could not be generated', 'progressive-wp'), [
                'status' => 500,
            ]);
        }
    }

    public function apiDeleteVapid()
    {
        self::deleteVapid();

        return [
            'deleted' => true,
        ];
    }

    public function apiGetVapid()
    {
        return self::getVapid();
    }

    public static function deleteVapid()
    {
        update_option(self::$vapid_option, self::$emptyVapid);
    }

    public static function regenerateVapid($subject = '')
    {
        $generatedVapid      = VAPID::createVapidKeys();
        $vapid['publicKey']  = $generatedVapid['publicKey'];
        $vapid['privateKey'] = $generatedVapid['privateKey'];
        $vapid['subject']    = $subject;

        return update_option(self::$vapid_option, $vapid);
    }

    public static function getVapid($maskPrivateKey = true)
    {
        $vapid = get_option(self::$vapid_option, self::$emptyVapid);

        if ($maskPrivateKey && strlen($vapid['privateKey']) !== 0) {
            $private             = $vapid['privateKey'];
            $starLength          = strlen($private) > 10 ? 10 : strlen($private) - 1;
            $vapid['privateKey'] = str_repeat('*', strlen($private) - $starLength) . substr($private, -$starLength);
        }

        return $vapid;
    }
}
