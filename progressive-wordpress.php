<?php

/*
Plugin Name: Progressive WordPress (PWA)
Plugin URI: https://github.com/SayHelloGmbH/progressive-wordpress
Description: Turn your website into a Progressive Web App and make it installable, offline ready and send push notifications.
Author: Nico Martin
Author URI: https://nicomartin.ch
Version: --2.1.10.6
Text Domain: progressive-wp
Domain Path: /languages
 */

global $wp_version;
if ( version_compare( $wp_version, '4.7', '<' ) || version_compare( PHP_VERSION, '5.4', '<' ) ) {
	function pwp_compatability_warning() {
		echo '<div class="error"><p>';
		// translators: Dependency warning
		echo sprintf( __( '“%1$s” requires PHP %2$s (or newer) and WordPress %3$s (or newer) to function properly. Your site is using PHP %4$s and WordPress %5$s. Please upgrade. The plugin has been automatically deactivated.', 'pwp' ), 'Advanced WPPerformance', '5.3', '4.7', PHP_VERSION, $GLOBALS['wp_version'] );
		echo '</p></div>';
		if ( isset( $_GET['activate'] ) ) {
			unset( $_GET['activate'] );
		}
	}

	add_action( 'admin_notices', 'pwp_compatability_warning' );

	function pwp_deactivate_self() {
		deactivate_plugins( plugin_basename( __FILE__ ) );
	}

	add_action( 'admin_init', 'pwp_deactivate_self' );

	return;
} else {
	define( 'PWP_SETTINGS_PARENT', 'progressive-wordpress' );
	define( 'PWP_SETTINGS_OPTION', 'pwp-option' );

	require_once 'vendor/autoload.php';

	require_once 'inc/funcs.php';
	require_once 'inc/funcs-global.php';
	require_once 'Classes/class-plugin.php';
	require_once 'Classes/class-init.php';
	require_once 'Classes/Libs/class-settings.php';
	require_once 'Classes/class-installable.php';
	require_once 'Classes/class-serviceworker.php';
	require_once 'Classes/class-manifest.php';
	require_once 'Classes/class-offlineusage.php';
	require_once 'Classes/class-pushcredentials.php';
	require_once 'Classes/class-push.php';
	require_once 'Classes/class-webpushcredentials.php';
	require_once 'Classes/class-webpush.php';
	require_once 'Classes/class-pushpost.php';
	require_once 'Classes/class-amp.php';

	/**
	 * Init Plugin
	 */
	function pwp_get_instance() {
		return nicomartin\ProgressiveWordPress\Plugin::get_instance( __FILE__ );
	}

	pwp_get_instance();

	pwp_get_instance()->Init = new nicomartin\ProgressiveWordPress\Init();
	pwp_get_instance()->Init->run();

	/**
	 * Init Settings
	 */

	function pwp_settings() {
		return nicomartin\ProgressiveWordPress\Settings::get_instance( 'pwp' );
	}

	pwp_settings()->set_parent_page( PWP_SETTINGS_PARENT );
	//pwp_settings()->set_debug( true );

	/**
	 * Installable
	 */

	pwp_get_instance()->Installable = new nicomartin\ProgressiveWordPress\Installable();
	pwp_get_instance()->Installable->run();

	/**
	 * Serviceworker
	 */

	pwp_get_instance()->Serviceworker = new nicomartin\ProgressiveWordPress\Serviceworker();
	pwp_get_instance()->Serviceworker->run();

	/**
	 * Manifest
	 */

	pwp_get_instance()->Manifest = new nicomartin\ProgressiveWordPress\Manifest();
	pwp_get_instance()->Manifest->run();

	/**
	 * Offline usage
	 */

	pwp_get_instance()->Offlineusage = new nicomartin\ProgressiveWordPress\Offlineusage();
	pwp_get_instance()->Offlineusage->run();

	/**
	 * Push
	 */

	if ( pwp_push_v2() ) {
		pwp_get_instance()->WebPushCredentials = new nicomartin\ProgressiveWordPress\WebPushCredentials();
		pwp_get_instance()->WebPushCredentials->run();
		pwp_get_instance()->WebPush = new nicomartin\ProgressiveWordPress\WebPush();
		pwp_get_instance()->WebPush->run();
	} else {
		pwp_get_instance()->PushCredentials = new nicomartin\ProgressiveWordPress\PushCredentials();
		pwp_get_instance()->PushCredentials->run();
		pwp_get_instance()->Push = new nicomartin\ProgressiveWordPress\Push();
		pwp_get_instance()->Push->run();
	}

	pwp_get_instance()->PushPost = new nicomartin\ProgressiveWordPress\PushPost();
	pwp_get_instance()->PushPost->run();

	/**
	 * AMP
	 */

	pwp_get_instance()->AMP = new nicomartin\ProgressiveWordPress\AMP();
	pwp_get_instance()->AMP->run();

	/**
	 * 3rd Patry Support
	 */


	// https://wordpress.org/plugins/amp/
	if ( pwp_plugin_active( 'amp/amp.php' ) ) {
		require_once '3rdparty-support/amp.php';
	}

	// https://wordpress.org/plugins/accelerated-mobile-pages/
	if ( pwp_plugin_active( 'accelerated-mobile-pages/accelerated-moblie-pages.php' ) ) {
		require_once '3rdparty-support/accelerated-moblie-pages.php';
	}

	/**
	 * Status
	 */

	require_once 'Classes/class-status.php';
	pwp_get_instance()->Status = new nicomartin\ProgressiveWordPress\Status();
	pwp_get_instance()->Status->run();

	/**
	 * Tracking
	 */

	require_once 'Classes/class-tracking.php';
	pwp_get_instance()->Tracking = new nicomartin\ProgressiveWordPress\Tracking();
	pwp_get_instance()->Tracking->run();
} // End if().
