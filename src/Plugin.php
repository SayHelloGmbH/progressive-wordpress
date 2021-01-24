<?php

namespace nicomartin\ProgressiveWordPress;

class Plugin {

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

	public static function getInstance( $file ) {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Plugin ) ) {
			self::$instance = new Plugin();

			if ( get_option( pwpGetInstance()->option_key ) ) {
				$data = get_option( pwpGetInstance()->option_key );
			} elseif ( function_exists( 'get_plugin_data' ) ) {
				$data = get_plugin_data( $file );
			} else {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
				$data = get_plugin_data( $file );
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
	private function run() {
		add_action( 'plugins_loaded', [ $this, 'loadPluginTextdomain' ] );
		add_action( 'admin_init', [ $this, 'updatePluginData' ] );
		register_deactivation_hook( pwpGetInstance()->file, [ $this, 'deactivate' ] );
		register_activation_hook( pwpGetInstance()->file, [ $this, 'activate' ] );

		add_filter( 'pwp_translation_strings', [ $this, 'pluginStrings' ] );
	}

	/**
	 * Load translation files from the indicated directory.
	 */
	public function loadPluginTextdomain() {
		load_plugin_textdomain(
			'progressive-wp',
			false,
			dirname( plugin_basename( pwpGetInstance()->file ) ) . '/languages'
		);
	}

	/**
	 * Update Plugin Data
	 */
	public function updatePluginData() {

		$db_data   = get_option( pwpGetInstance()->option_key );
		$file_data = get_plugin_data( pwpGetInstance()->file );

		if ( ! $db_data || version_compare( $file_data['Version'], $db_data['Version'], '>' ) ) {

			pwpGetInstance()->name    = $file_data['Name'];
			pwpGetInstance()->version = $file_data['Version'];

			update_option( pwpGetInstance()->option_key, $file_data );

			if ( ! $db_data ) {
				do_action( 'pwp_on_first_activate' );
			} else {
				do_action( 'pwp_on_update', $db_data['Version'], $file_data['Version'] );
			}
		}
	}

	public function activate() {
		do_action( 'pwp_on_activate' );
	}

	public function deactivate() {
		do_action( 'pwp_on_deactivate' );
		delete_option( pwpGetInstance()->option_key );
	}

	public function pluginStrings( $strings ) {
		$strings['plugin.name']                 = pwpGetInstance()->name;
		$strings['plugin.menu.about']           = __( 'About', 'progressive-wp' );
		$strings['plugin.menu.manifest']        = __( 'Add to Homescreen', 'progressive-wp' );
		$strings['plugin.menu.offline']         = __( 'Offline usage', 'progressive-wp' );
		$strings['plugin.menu.push']            = __( 'Push Notifications', 'progressive-wp' );
		$strings['plugin.intro.manifest.title'] = __( 'Provide an <b>integrated</b> user experience!', 'progressive-wp' );
		$strings['plugin.intro.manifest']       = __( 'Progressive WordPress makes it easy to encourage users to add your website to their homescreen. But that\'s not all. It also allows you to control the display behaviour of your website so it will be shown without any browser elements. Just like a native app.', 'progressive-wp' );
		$strings['plugin.intro.offline.title']  = __( 'Make your website <b>reliable</b>. Even on flaky internet connections!', 'progressive-wp' );
		$strings['plugin.intro.offline']        = __( 'No connection? No problem. Progressive WordPress pre-caches all critical assets of your website, as well as all visited resources. So if there\'s no internet connection it will serve the resources from the local storage. No more error downasaur!', 'progressive-wp' );
		$strings['plugin.intro.push.title']     = __( 'Keep your users <b>engaged</b> by sending push notifications!', 'progressive-wp' );
		$strings['plugin.intro.push']           = __( 'You just published new content and you want to let everyone know? Why not send a push notification? Progressive WordPress has an integrated connection to Firebase that lets you manage registered devices and send push notifications to all or selected devices!', 'progressive-wp' );
		$strings['plugin.footer.thanks']        = __( 'Thank you for using Progressive WordPress (PWA)!', 'progressive-wp' );
		$strings['plugin.footer.credits']       = __( 'This plugin was developed by {author} to use progressive web app features for your WordPress website.', 'progressive-wp' );
		$strings['plugin.footer.involved']      = __( 'If you like this plugin feel free to get involved with the development on {github}', 'progressive-wp' );
		$strings['plugin.footer.help.title']    = __( 'Need Help?', 'progressive-wp' );
		$strings['plugin.footer.help.support']  = __( 'Please make sure your device supports Progressive Web Apps.', 'progressive-wp' );
		$strings['plugin.footer.help.contact']  = __( 'Still not working? Please visit the support forum.', 'progressive-wp' );

		return $strings;
	}
}
