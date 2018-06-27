<?php

/*
Plugin Name: Progressive WordPress (PWA)
Plugin URI: https://github.com/SayHelloGmbH/progressive-wordpress
Description: Turn your website into a Progressive Web App and make it installable, offline ready and send push notifications.
Author: Nico Martin
Author URI: https://nicomartin.ch
Version: 1.3.1
Text Domain: pwp
Domain Path: /languages
 */

define( 'PROGRESSIVE_WP_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'PROGRESSIVE_WP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

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

	require_once 'inc/funcs.php';
	require_once 'inc/funcs-global.php';

	/**
	 * Init Plugin
	 */
	require_once 'Classes/class-plugin.php';
	function pwp_get_instance() {
		return nicomartin\ProgressiveWordPress\Plugin::get_instance( __FILE__ );
	}

	pwp_get_instance();

	require_once 'Classes/class-init.php';
	pwp_get_instance()->Init = new nicomartin\ProgressiveWordPress\Init();
	pwp_get_instance()->Init->run();

	/**
	 * Init Settings
	 */

	require_once 'Classes/Libs/class-settings.php';
	function pwp_settings() {
		return nicomartin\ProgressiveWordPress\Settings::get_instance( 'pwp' );
	}

	pwp_settings()->set_parent_page( PWP_SETTINGS_PARENT );
	//pwp_settings()->set_debug( true );

	/**
	 * Installable
	 */

	require_once 'Classes/class-installable.php';
	pwp_get_instance()->Installable = new nicomartin\ProgressiveWordPress\Installable();
	pwp_get_instance()->Installable->run();

	/**
	 * Serviceworker
	 */

	require_once 'Classes/class-serviceworker.php';
	pwp_get_instance()->Serviceworker = new nicomartin\ProgressiveWordPress\Serviceworker();
	pwp_get_instance()->Serviceworker->run();

	/**
	 * Manifest
	 */

	require_once 'Classes/class-manifest.php';
	pwp_get_instance()->Manifest = new nicomartin\ProgressiveWordPress\Manifest();
	pwp_get_instance()->Manifest->run();

	/**
	 * Offline usage
	 */

	require_once 'Classes/class-offlineusage.php';
	pwp_get_instance()->Offlineusage = new nicomartin\ProgressiveWordPress\Offlineusage();
	pwp_get_instance()->Offlineusage->run();

	/**
	 * Push
	 */

	require_once 'Classes/class-pushcredentials.php';
	pwp_get_instance()->PushCredentials = new nicomartin\ProgressiveWordPress\PushCredentials();
	pwp_get_instance()->PushCredentials->run();

	require_once 'Classes/class-push.php';
	pwp_get_instance()->Push = new nicomartin\ProgressiveWordPress\Push();
	pwp_get_instance()->Push->run();

	require_once 'Classes/class-pushpost.php';
	pwp_get_instance()->PushPost = new nicomartin\ProgressiveWordPress\PushPost();
	pwp_get_instance()->PushPost->run();

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
