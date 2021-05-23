<?php

namespace nicomartin\ProgressiveWordPress;

/*
Assets Name: Progressive WordPress (PWA)
Assets URI: https://github.com/SayHelloGmbH/progressive-wordpress
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
    require_once 'vendor/autoload.php';

    require_once 'src/Plugin/Helpers.php';
    require_once 'src/Plugin/Plugin.php';
    require_once 'src/Plugin/AdminPage.php';
    require_once 'src/Plugin/Settings.php';
    require_once 'src/Plugin/Assets.php';

    require_once 'src/RegisterManifest.php';
    require_once 'src/RegisterServiceWorker.php';
    require_once 'src/AddToHomescreen.php';
    require_once 'src/OfflineUsage.php';
    require_once 'src/OfflineIndicator.php';
    require_once 'src/Tracking.php';
    require_once 'src/PushCredentialsWebPush.php';
    require_once 'src/PushCredentialsFirebase.php';
    require_once 'src/PushNotifications.php';
    require_once 'src/PushSubscriptions.php';

    require_once 'src/Push/WebPushNotification.php';

    function pwpGetInstance()
    {
        return Plugin::getInstance(__FILE__);
    }

    pwpGetInstance();

    /**
     * Assets
     */

    pwpGetInstance()->Settings = new Settings();
    pwpGetInstance()->Settings->run();

    pwpGetInstance()->AdminPage = new AdminPage();
    pwpGetInstance()->AdminPage->run();

    pwpGetInstance()->Assets = new Assets();
    pwpGetInstance()->Assets->run();

    /**
     * Register
     */

    pwpGetInstance()->RegisterManifest = new RegisterManifest();
    pwpGetInstance()->RegisterManifest->run();

    pwpGetInstance()->RegisterServiceWorker = new RegisterServiceWorker();
    pwpGetInstance()->RegisterServiceWorker->run();

    /**
     * Modules
     */

    pwpGetInstance()->AddToHomescreen = new AddToHomescreen();
    pwpGetInstance()->AddToHomescreen->run();

    pwpGetInstance()->OfflineUsage = new OfflineUsage();
    pwpGetInstance()->OfflineUsage->run();

    pwpGetInstance()->OfflineIndicator = new OfflineIndicator();
    pwpGetInstance()->OfflineIndicator->run();

    pwpGetInstance()->Tracking = new Tracking();
    pwpGetInstance()->Tracking->run();

    pwpGetInstance()->PushCredentialsWebPush = new PushCredentialsWebPush();
    pwpGetInstance()->PushCredentialsWebPush->run();

    pwpGetInstance()->PushCredentialsFirebase = new PushCredentialsFirebase();
    pwpGetInstance()->PushCredentialsFirebase->run();

    pwpGetInstance()->PushNotifications = new PushNotifications();
    pwpGetInstance()->PushNotifications->run();

    pwpGetInstance()->PushSubscriptions = new PushSubscriptions();
    pwpGetInstance()->PushSubscriptions->run();
} // End if().
