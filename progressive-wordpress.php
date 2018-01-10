<?php

/*
Plugin Name: Progressive WordPress
Plugin URI: https://github.com/nico-martin/progressive-wordpress
Description: This plugin adds progressive features to your WordPress site and turns it into a Progressive Web App.
Author: Nico Martin
Version: 0.0.5
Author URI: https://nicomartin.ch
Text Domain: pwp
Domain Path: /languages
 */

global $wp_version;
if ( version_compare( $wp_version, '4.7', '<' ) || version_compare( PHP_VERSION, '5.4', '<' ) ) {
	function pwp_compatability_warning() {
		echo '<div class="error"><p>';
		// translators: Dependency waring
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
} // End if().
