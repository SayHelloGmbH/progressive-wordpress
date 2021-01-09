<?php

namespace nicomartin\ProgressiveWordPress;

class Plugin {

	private static $instance;

	public string $name = '';
	public string $version = '';
	public string $prefix = '';
	public string $apiNamespace = '';
	public bool $debug = false;
	public $file;

	public string $upload_dir = '';
	public string $upload_url = '';

	public string $option_key = 'pwp_data';

	public Settings $settings;
	public AdminPage $adminPage;
	public Assets $assets;

	public static function get_instance( $file ): Plugin {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Plugin ) ) {

			self::$instance = new Plugin();

			if ( get_option( pwp_get_instance()->option_key ) ) {
				$data = get_option( pwp_get_instance()->option_key );
			} elseif ( function_exists( 'get_plugin_data' ) ) {
				$data = get_plugin_data( $file );
			} else {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
				$data = get_plugin_data( $file );
			}

			self::$instance->name    = $data['Name'];
			self::$instance->version = $data['Version'];

			self::$instance->prefix       = 'pwp';
			self::$instance->apiNamespace = 'pwp/v1';
			self::$instance->debug        = true;
			self::$instance->file         = $file;

			self::$instance->upload_dir = wp_upload_dir()['basedir'] . '/progressive-wp/';
			self::$instance->upload_url = wp_upload_dir()['baseurl'] . '/progressive-wp/';

			self::$instance->run();
		}

		return self::$instance;
	}

	/**
	 * Execution function which is called after the class has been initialized.
	 * This contains hook and filter assignments, etc.
	 */
	private function run() {
		add_action( 'plugins_loaded', [ $this, 'load_plugin_textdomain' ] );
		add_action( 'admin_init', [ $this, 'update_plugin_data' ] );
		register_deactivation_hook( pwp_get_instance()->file, [ $this, 'deactivate' ] );
		register_activation_hook( pwp_get_instance()->file, [ $this, 'activate' ] );

		if ( ! is_dir( pwp_get_instance()->upload_dir ) ) {
			mkdir( pwp_get_instance()->upload_dir );
		}
	}

	/**
	 * Load translation files from the indicated directory.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'pwp', false, dirname( plugin_basename( pwp_get_instance()->file ) ) . '/languages' );
	}

	/**
	 * Update Plugin Data
	 */
	public function update_plugin_data() {

		$db_data   = get_option( pwp_get_instance()->option_key );
		$file_data = get_plugin_data( pwp_get_instance()->file );

		if ( ! $db_data || version_compare( $file_data['Version'], $db_data['Version'], '>' ) ) {

			pwp_get_instance()->name    = $file_data['Name'];
			pwp_get_instance()->version = $file_data['Version'];

			update_option( pwp_get_instance()->option_key, $file_data );

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
		delete_option( pwp_get_instance()->option_key );
	}

}
