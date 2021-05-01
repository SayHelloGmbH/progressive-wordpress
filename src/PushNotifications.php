<?php

namespace nicomartin\ProgressiveWordPress;

class PushNotifications
{
    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);
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

        return $vars;
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
    }

    /**
     * Helpers
     */

    private static function isHex($value)
    {
        return preg_match('/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value);
    }
}
