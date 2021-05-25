<?php

namespace nicomartin\ProgressiveWordPress;

class Plugin
{

    private static $instance;

    public $name = '';
    public $version = '';
    public $prefix = '';
    public $api_namespace = '';
    public $debug = false;
    public $file;

    public $upload_dir = '';
    public $upload_url = '';

    public $option_key = 'pwp_data';

    public $settings;
    public $admin_page;
    public $assets;

    public static function getInstance($file)
    {
        if ( ! isset(self::$instance) && ! (self::$instance instanceof Plugin)) {
            self::$instance = new Plugin();

            if (get_option(pwpGetInstance()->option_key)) {
                $data = get_option(pwpGetInstance()->option_key);
            } elseif (function_exists('get_plugin_data')) {
                $data = get_plugin_data($file);
            } else {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
                $data = get_plugin_data($file);
            }

            self::$instance->name    = $data['Name'];
            self::$instance->version = $data['Version'];

            self::$instance->prefix        = 'pwp';
            self::$instance->api_namespace = 'pwp/v1';
            self::$instance->debug         = true;
            self::$instance->file          = $file;

            self::$instance->run();
        }

        return self::$instance;
    }

    /**
     * Execution function which is called after the class has been initialized.
     * This contains hook and filter assignments, etc.
     */
    private function run()
    {
        add_action('plugins_loaded', [$this, 'loadPluginTextdomain']);
        add_action('admin_init', [$this, 'updatePluginData']);
        register_deactivation_hook(pwpGetInstance()->file, [$this, 'deactivate']);
        register_activation_hook(pwpGetInstance()->file, [$this, 'activate']);

        add_filter('pwp_plugin_strings', [$this, 'pluginStrings']);
    }

    /**
     * Load translation files from the indicated directory.
     */
    public function loadPluginTextdomain()
    {
        load_plugin_textdomain(
            'progressive-wp',
            false,
            dirname(plugin_basename(pwpGetInstance()->file)) . '/languages'
        );
    }

    /**
     * Update Assets Data
     */
    public function updatePluginData()
    {

        $db_data   = get_option(pwpGetInstance()->option_key);
        $file_data = get_plugin_data(pwpGetInstance()->file);

        if ( ! $db_data || version_compare($file_data['Version'], $db_data['Version'], '>')) {

            pwpGetInstance()->name    = $file_data['Name'];
            pwpGetInstance()->version = $file_data['Version'];

            update_option(pwpGetInstance()->option_key, $file_data);

            if ( ! $db_data) {
                do_action('pwp_on_first_activate');
            } else {
                do_action('pwp_on_update', $db_data['Version'], $file_data['Version']);
            }
        }
    }

    public function activate()
    {
        do_action('pwp_on_activate');
    }

    public function deactivate()
    {
        do_action('pwp_on_deactivate');
        delete_option(pwpGetInstance()->option_key);
    }

    public function pluginStrings($strings)
    {
        $strings['plugin.name'] = pwpGetInstance()->name;

        return $strings;
    }
}
