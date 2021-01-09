<?php

namespace nicomartin\ProgressiveWordPress;

/*
Plugin Name: Progressive WordPress (PWA)
Plugin URI: https://github.com/SayHelloGmbH/progressive-wordpress
Description: Turn your website into a Progressive Web App and make it installable, offline ready and send push notifications.
Author: Nico Martin
Author URI: https://nicomartin.ch
Version: 2.2.0-beta
Text Domain: progressive-wp
Domain Path: /languages
 */

global $wp_version;
if ( version_compare( $wp_version, '4.7', '<' ) || version_compare( PHP_VERSION, '7.0', '<' ) ) {
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

	require_once 'src/class-helpers.php';

	require_once 'src/class-plugin.php';
	function pwp_get_instance(): Plugin {
		return Plugin::get_instance( __FILE__ );
	}

	pwp_get_instance();

	require_once 'api/class-settings.php';
	pwp_get_instance()->settings = new Settings();
	pwp_get_instance()->settings->registerSetting( 'test', 'Test', function ( $value ): string {
		return $value !== 'test' ? 'not valid' : '';
	} );
	pwp_get_instance()->settings->run();

	require_once 'src/class-adminpage.php';
	pwp_get_instance()->adminPage = new AdminPage();
	pwp_get_instance()->adminPage->run();

	require_once 'src/class-assets.php';
	pwp_get_instance()->assets = new Assets();
	pwp_get_instance()->assets->run();

} // End if().
