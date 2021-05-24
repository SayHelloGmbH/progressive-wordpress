<?php

namespace nicomartin\ProgressiveWordPress;

use Minishlink\WebPush\VAPID;

class PushCredentialsWebPush
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
        add_filter('pwp_footer_js', [$this, 'footerUiJs']);

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

    public function footerUiJs($values)
    {
        if (self::issetVapid() && PushNotifications::getPushProvider() === 'webpush') {
            $vapid                   = self::getVapid();
            $values['vapidPublcKey'] = $vapid['publicKey'];
        }

        return $values;
    }

    public function apiSetVapid($req)
    {
        $params  = $req->get_params();
        $subject = $params['subject'];

        if ($subject === '' || ( ! Helpers::isEmail($subject) && ! Helpers::isUrl($subject))) {
            return new \WP_Error(
                'vapid_subject_invalid',
                __('Subject must be a valid email or URL', 'progressive-wp'),
                [
                    'status' => 400,
                ]
            );
        }

        if (Helpers::isEmail($subject)) {
            $subject = "mailto:<{$subject}>";
        }

        if (self::issetVapid()) {
            return new \WP_Error('vapid_already_set', __('VAPID already set', 'progressive-wp'), [
                'status' => 400,
            ]);
        }

        $generated = self::regenerateVapid($subject);
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

        return self::getVapid();
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
        /*
        $generatedVapid      = [
            'publicKey'  => 'BCDDyJGde94pQn802U8zZPZIzbTT8LYzaDcGLxL2-ipoXY8QTQS-zvC7QXJXf4sKHf2N8fVP0-7eBnFExe2nAMk',
            'privateKey' => 'Zli-ptfBaCudV-jWrhrhPdR3ESUXQTqXVCIM8HI4GPw',
        ];
        */
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

    public static function issetVapid()
    {
        $vapid = self::getVapid();

        return ($vapid['publicKey'] !== '' && $vapid['privateKey'] !== '');
    }
}
