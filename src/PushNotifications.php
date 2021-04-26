<?php

namespace nicomartin\ProgressiveWordPress;

class PushNotifications
{
    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);
        /*add_filter('pwp_push_use_firebase', function () {
            return true;
AAAAk9pstwM:APA91bGdai_bzip_f-TBa3RH3PEBJyl1sL4hWUd3jfK0B1suQ-hdi3Sn0zOb4JnMJi_GmbE5meQSLgIoAWonLumf6Ncd2YRM0Fyr9yTeuJNsidsyp8BEI7VvjOUPGKZnaqg49E9KMRkA
635024750339
            return false;
        });*/
        add_filter('pwp_push_use_firebase', function () {
            return true;
        });
        add_action('rest_api_init', [$this, 'registerRoute']);
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
}
