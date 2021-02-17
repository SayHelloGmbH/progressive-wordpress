<?php

namespace nicomartin\ProgressiveWordPress;

class RegisterManifest
{
    public $rest_route = '/pwp-manifest';
    public static $filter = 'web_app_manifest';

    public function run()
    {
        add_action('rest_api_init', [$this, 'registerManifestRestRoute']);
        add_action('wp_head', [$this, 'manifestLinkAndMeta']);
        add_filter(self::$filter, [$this, 'httpsifyStartUrl'], 999);
    }

    public function registerManifestRestRoute()
    {
        register_rest_route(pwpGetInstance()->api_namespace, $this->rest_route, [
            'methods'             => 'GET',
            'callback'            => [$this, 'getManifest'],
            'permission_callback' => [$this, 'restPermission'],
        ]);
    }

    public function getManifest()
    {
        return apply_filters('web_app_manifest', [
            'name'      => get_bloginfo('name'),
            'start_url' => get_site_url(),
            'display'   => 'minimal-ui',
            'dir'       => is_rtl() ? 'rtl' : 'ltr',
            'lang'      => get_bloginfo('language'),
        ]);
    }

    public function restPermission($request)
    {
        if ('edit' === $request['context']) {
            return new \WP_Error(
                'rest_forbidden_context',
                __(
                    'Sorry, you are not allowed to edit the manifest.',
                    'progressive-wp'
                ),
                [
                    'status' => rest_authorization_required_code(),
                ]
            );
        }

        return true;
    }

    public function manifestLinkAndMeta()
    {
        if (class_exists('WP_Web_App_Manifest')) {
            return;
        }

        $theme_color  = pwpGetInstance()->Settings->getSingleSettingValue('manifest-theme-color');
        $manifest_url = esc_url(rest_url(pwpGetInstance()->api_namespace . $this->rest_route));

        echo "<link rel='manifest' href='{$manifest_url}'>";
        if ($theme_color) {
            echo "<meta name='theme-color' content='{$theme_color}'>";
        }
    }

    public function httpsifyStartUrl($manifest)
    {
        if (array_key_exists('start_url', $manifest)) {
            $manifest['start_url'] = str_replace('http://', 'https://', $manifest['start_url']);
        }

        return $manifest;
    }
}
