<?php

namespace nicomartin\ProgressiveWordPress;

class Assets
{
    public function run()
    {
        add_action('wp_enqueue_scripts', [$this, 'addAssets']);
        add_action('admin_enqueue_scripts', [$this, 'addAdminAssets']);
    }

    public function addAssets()
    {
        $script_version = pwpGetInstance()->version;
        $dir_uri        = trailingslashit(plugin_dir_url(pwpGetInstance()->file));

        wp_enqueue_style(
            pwpGetInstance()->prefix . '-ui-style',
            $dir_uri . 'assets/dist/ui.css',
            [],
            $script_version
        );
        wp_enqueue_script(
            pwpGetInstance()->prefix . '-ui-script',
            $dir_uri . 'assets/dist/ui.js',
            [],
            $script_version,
            true
        );
    }

    public function addAdminAssets()
    {
        $script_version = pwpGetInstance()->version;
        $dir_uri        = trailingslashit(plugin_dir_url(pwpGetInstance()->file));

        wp_enqueue_media();
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('react', $dir_uri . 'assets/react.production.min.js', [], '17', true);
        wp_enqueue_script('react-dom', $dir_uri . 'assets/react-dom.production.min.js', [], '17', true);

        wp_enqueue_style(
            pwpGetInstance()->prefix . '-admin-style',
            $dir_uri . 'assets/dist/admin.css',
            [],
            $script_version
        );
        wp_enqueue_script(
            pwpGetInstance()->prefix . '-admin-script',
            $dir_uri . 'assets/dist/admin.js',
            [
                'react',
                'react-dom',
                'wp-color-picker',
                'wp-components',
                'wp-i18n',
            ],
            $script_version,
            true
        );

        /**
         * Admin Footer JS
         */

        $defaults = [
            'ajaxUrl'        => admin_url('admin-ajax.php'),
            'homeUrl'        => trailingslashit(get_site_url()),
            'generalError'   => __('An unexpected error occured', 'progressive-wp'),
            'settings'       => pwpGetInstance()->settings->getSettings(),
            'settingsData'   => pwpGetInstance()->settings->getSettings(),
            'restBase'       => trailingslashit(get_rest_url()),
            'restPluginBase' => trailingslashit(get_rest_url() . pwpGetInstance()->api_namespace),
            'pluginStrings'  => apply_filters('pwp_plugin_strings', []),
        ];

        $vars = json_encode(apply_filters('pwp_admin_footer_js', $defaults));

        wp_add_inline_script(pwpGetInstance()->prefix . '-admin-script', "var pwpJsVars = {$vars};", 'before');
    }
}
