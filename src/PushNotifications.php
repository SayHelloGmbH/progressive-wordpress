<?php

namespace nicomartin\ProgressiveWordPress;

class PushNotifications
{
    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);
        add_action('pwp_serviceworker', [$this, 'serviceWorker']);
        add_action('rest_api_init', [$this, 'registerRoute']);
        add_action('wp_footer', [$this, 'addPushButton']);
    }

    public function settings($settings)
    {
        $settings['push-badge'] = [
            'default'  => '',
            'label'    => __('Notification Bar Icon', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['notification-button'] = [
            'default'  => false,
            'label'    => __('Add notification button', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['notification-button-icon-color'] = [
            'default'  => '#ffffff',
            'label'    => __('Icon color', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['notification-button-bkg-color'] = [
            'default'  => '#000000',
            'label'    => __('Background color', 'progressive-wp'),
            'validate' => null,
        ];

        /*
        $settings['notification-button-bkg-color'] = [
            'default'  => '#000000',
            'label'    => __('Background color', 'progressive-wp'),
            'validate' => null,
        ];*/

        return $settings;
    }

    public function footerJs($vars)
    {
        $vars['pushProvider'] = self::getPushProvider();
        $vars['faviconId']    = get_option('site_icon');

        return $vars;
    }

    public function serviceWorker()
    {
        if ( ! PushCredentialsWebPush::issetVapid()) {
            return;
        }
        $pushContent = '';
        $pushFile    = plugin_dir_path(pwpGetInstance()->file) . '/assets/serviceworker/webpush.js';
        if (file_exists($pushFile)) {
            $pushContent .= file_get_contents($pushFile);
        }

        /*
        $path = plugin_dir_path(pwp_get_instance()->file) . 'Classes/Libs';
        require_once $path . '/minify/autoload.php';
        require_once $path . '/path-converter/autoload.php';
        $minifier     = new \MatthiasMullie\Minify\JS($push_content);
        $push_content = $minifier->minify();
        */

        echo $pushContent;
    }

    public function addPushButton()
    {
        if ( ! pwpGetInstance()->Settings->getSingleSettingValue('notification-button')) {
            return;
        }

        $dir      = trailingslashit(plugin_dir_path(pwpGetInstance()->file)) . 'assets/img/icon/';
        $icon_on  = $dir . 'bell-ring.svg';
        $icon_off = $dir . 'bell-off.svg';

        if ( ! is_file($icon_on) || ! is_file($icon_off)) {
            return;
        }

        $icon_on  = file_get_contents($icon_on);
        $icon_off = file_get_contents($icon_off);

        $background_color = pwpGetInstance()->Settings->getSingleSettingValue('notification-button-bkg-color');
        if ( ! self::isHex($background_color)) {
            $background_color = '#333';
        }

        $icon_color = pwpGetInstance()->Settings->getSingleSettingValue('notification-button-icon-color');
        if ( ! self::isHex($icon_color)) {
            $icon_color = '#fff';
        }

        $style = "background-color: $background_color; color: $icon_color; font-size: 35px";
        $html  = '';
        $html  .= "<button onclick='pwpHandlePushDevice()' id='pwp-notification-button' class='pwp-notification-button' style='$style'>";
        $html  .= "<span class='pwp-notification-button__icon pwp-notification-button__icon--on'>$icon_on</span>";
        $html  .= "<span class='pwp-notification-button__icon pwp-notification-button__icon--off'>$icon_off</span>";
        $html  .= "<span class='pwp-notification-button__icon pwp-notification-button__icon--spinner'></span>";
        $html  .= '</button>';

        echo $html;
    }

    public static function getPushProvider()
    {
        $firebase = apply_filters('pwp_push_use_firebase', PushCredentialsFirebase::issetFirebaseCredentials());

        return $firebase ? 'firebase' : 'webpush';
    }

    public function registerRoute()
    {
        register_rest_route(pwpGetInstance()->api_namespace, 'push-provider', [
            'methods'             => 'GET',
            'callback'            => function () {
                return [
                    'provider' => self::getPushProvider(),
                ];
            },
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'push-send', [
            'methods'             => 'POST',
            'callback'            => [$this, 'apiSendPush'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);
    }

    public function apiSendPush($req)
    {
        $params = $req->get_params();
        return self::sendPush(
            $params['title'],
            $params['body'],
            $params['url'],
            $params['image'],
            $params['receiver'],
            $params['postId']
        );
    }

    public static function sendPush($title, $body, $url, $image, $receiver = null, $postId = 0)
    {
        $push = new WebPushNotification();
        $push->setData($title, $body, $url, $image);
        if ($receiver) {
            $push->setSubscriptionsByIDs($receiver);
        }

        $sent = $push->send();
        do_action(
            'pwp_on_push_sent',
            $sent,
            [
                'title' => $title,
                'body'  => $body,
                'url'   => $url,
                'image' => $image,
            ],
            $receiver,
            $postId
        );

        return $sent;
    }

    /**
     * Helpers
     */

    private static function isHex($value)
    {
        return preg_match('/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value);
    }
}
