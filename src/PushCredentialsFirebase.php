<?php

namespace nicomartin\ProgressiveWordPress;

class PushCredentialsFirebase
{
    public static $firebase_option = 'pwp_firebase-credentials';
    public static $emptyCredentials = [
        'serverKey' => '',
        'senderId'  => '',
    ];

    public function run()
    {
        if (get_option(self::$firebase_option, null) === null) {
            /**
             * Fallback for versions before v3
             */
            $settings = get_option('settings', []);
            if (
                array_key_exists('firebase-serverkey', $settings) &&
                $settings['firebase-serverkey'] &&
                array_key_exists('firebase-senderid', $settings) &&
                $settings['firebase-senderid']
            ) {
                update_option(self::$firebase_option, [
                    'serverKey' => $settings['firebase-serverkey'],
                    'senderId'  => $settings['firebase-senderid'],
                ]);
            } else {
                update_option(self::$firebase_option, self::$emptyCredentials);
            }
        }
        add_action('rest_api_init', [$this, 'registerRoute']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);
        add_filter('web_app_manifest', [$this, 'senderIdManifest']);
    }

    public function registerRoute()
    {
        register_rest_route(pwpGetInstance()->api_namespace, 'firebase-credentials', [
            'methods'             => 'PUT',
            'callback'            => [$this, 'apiSetCredentials'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'firebase-credentials', [
            'methods'             => 'DELETE',
            'callback'            => [$this, 'apiDeleteCredentials'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);

        register_rest_route(pwpGetInstance()->api_namespace, 'firebase-credentials', [
            'methods'             => 'GET',
            'callback'            => [$this, 'apiGetCredentials'],
            'permission_callback' => function () {
                return current_user_can(Helpers::$authAdmin);
            }
        ]);
    }

    public function footerJs($values)
    {
        $values['firebasePushCredentials'] = self::getCredentials();

        return $values;
    }

    public function senderIdManifest($values)
    {
        if (PushNotifications::getPushProvider() === 'firebase' && self::getCredentials()['senderId'] !== '') {
            $values['gcm_sender_id'] = self::getCredentials()['senderId'];
        }

        return $values;
    }

    public function apiSetCredentials($req)
    {
        $params    = $req->get_params();
        $serverKey = $params['serverKey'];
        $senderId  = $params['senderId'];
        if ( ! $senderId || ! $serverKey || ! self::isValidServerKey($serverKey)) {
            return new \WP_Error(
                'firebase_credentials_invalid',
                __('Invalid Firebase credentials', 'progressive-wp'),
                [
                    'status' => 400,
                ]
            );
        }

        $saved = update_option(self::$firebase_option, [
            'serverKey' => $serverKey,
            'senderId'  => $senderId,
        ]);

        if ($saved) {
            return self::getCredentials();
        }

        return new \WP_Error(
            'firebase_credentials_failed',
            __('Firebase Credentials could not be saved', 'progressive-wp'),
            [
                'status' => 500,
            ]
        );
    }

    public function apiDeleteCredentials()
    {
        self::deleteCredentials();

        return self::getCredentials();
    }

    public function apiGetCredentials()
    {
        return self::getCredentials();
    }

    public function deleteCredentials()
    {
        update_option(self::$firebase_option, self::$emptyCredentials);
    }

    public static function getCredentials()
    {
        return get_option(self::$firebase_option, self::$emptyCredentials);
    }

    private static function isValidServerKey($serverKey)
    {
        return count(explode(':', $serverKey)) == 2;
    }

    public static function issetFirebaseCredentials()
    {
        $credentials = self::getCredentials();

        return $credentials['serverKey'] !== '';
    }
}
