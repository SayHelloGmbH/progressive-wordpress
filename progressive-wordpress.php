<?php

namespace nicomartin\ProgressiveWordPress;

/*
Plugin Name: Progressive WordPress (PWA)
Plugin URI: https://github.com/SayHelloGmbH/progressive-wordpress
Description: Turn your website into a Progressive Web App and make it installable, offline ready and send push notifications.
Author: Nico Martin
Author URI: https://nicomartin.ch
Version: 2.2.-1
Text Domain: progressive-wp
Domain Path: /languages
 */

global $wp_version;
if (version_compare($wp_version, '4.7', '<') || version_compare(PHP_VERSION, '7.2.1', '<')) {
    add_action('admin_notices', function () {
        echo '<div class="error"><p>';
        // translators: Dependency warning
        echo sprintf(
            __(
                '“%1$s” requires PHP %2$s (or newer) and WordPress %3$s (or newer) to function properly. Your site is using PHP %4$s and WordPress %5$s. Please upgrade. The plugin has been automatically deactivated.',
                'pwp'
            ),
            'Advanced WPPerformance',
            '5.3',
            '4.7',
            PHP_VERSION,
            $GLOBALS['wp_version']
        );
        echo '</p></div>';
        if (isset($_GET['activate'])) {
            unset($_GET['activate']);
        }
    });

    add_action('admin_init', function () {
        deactivate_plugins(plugin_basename(__FILE__));
    });

    return;
} else {
    require_once 'src/plugin/Helpers.php';
    require_once 'src/plugin/Plugin.php';
    require_once 'vendor/autoload.php';

    function pwpGetInstance(): Plugin
    {
        return Plugin::getInstance(__FILE__);
    }

    pwpGetInstance();

    /**
     * Register
     */

    require_once 'src/RegisterManifest.php';
    pwpGetInstance()->RegisterManifest = new RegisterManifest();
    pwpGetInstance()->RegisterManifest->run();

    require_once 'src/RegisterServiceWorker.php';
    pwpGetInstance()->RegisterServiceWorker = new RegisterServiceWorker();
    pwpGetInstance()->RegisterServiceWorker->run();

    /**
     * Plugin
     */

    require_once 'src/plugin/Settings.php';
    pwpGetInstance()->Settings = new Settings();
    pwpGetInstance()->Settings->run();

    require_once 'src/plugin/AdminPage.php';
    pwpGetInstance()->AdminPage = new AdminPage();
    pwpGetInstance()->AdminPage->run();

    require_once 'src/plugin/Assets.php';
    pwpGetInstance()->Assets = new Assets();
    pwpGetInstance()->Assets->run();

    /**
     * Modules
     */

    require_once 'src/AddToHomescreen.php';
    pwpGetInstance()->AddToHomescreen = new AddToHomescreen();
    pwpGetInstance()->AddToHomescreen->run();

    require_once 'src/OfflineUsage.php';
    pwpGetInstance()->OfflineUsage = new OfflineUsage();
    pwpGetInstance()->OfflineUsage->run();

    require_once 'src/OfflineIndicator.php';
    pwpGetInstance()->OfflineIndicator = new OfflineIndicator();
    pwpGetInstance()->OfflineIndicator->run();

    require_once 'src/Tracking.php';
    pwpGetInstance()->Tracking = new Tracking();
    pwpGetInstance()->Tracking->run();

    require_once 'src/PushCredentials.php';
    pwpGetInstance()->PushCredentials = new PushCredentials();
    pwpGetInstance()->PushCredentials->run();
} // End if().
