<?php

namespace nicomartin\ProgressiveWordPress;

class Status {

	public $upload_dir = '';
	public $upload_url = '';

	public function __construct() {

		$this->upload_dir = trailingslashit( pwp_get_instance()->upload_dir ) . 'debug/';
		$this->upload_url = trailingslashit( pwp_get_instance()->upload_url ) . 'debug/';
	}

	public function run() {

		/**
		 * Ajax
		 */

		add_action( 'wp_ajax_pwp_ajax_download_log-debug-log', [ $this, 'download_log' ] );

		/**
		 * Clear
		 */

		add_action( 'init', [ $this, 'delete_logfiles' ] );
	}

	/**
	 * Ajax
	 */

	public function download_log() {

		$log = $this->generate_debug_log();
		if ( $log ) {
			pwp_exit_ajax( 'success', '', [
				'url'  => $log,
				'file' => 'progressive-wp-debug-log.json',
			] );
		} else {
			pwp_exit_ajax( 'error', __( 'Logfile could not be created', 'progressive-wp' ) );
		}

		pwp_exit_ajax( 'error', __( 'Error', 'progressive-wp' ) );
	}

	public function delete_logfiles() {
		if ( is_dir( $this->upload_dir ) ) {
			self::empty_dir( $this->upload_dir );
		}
	}

	/**
	 * Helpers
	 */

	public function generate_debug_log() {

		if ( ! is_dir( $this->upload_dir ) ) {
			mkdir( $this->upload_dir );
		}

		$log              = [];
		$log['generated'] = date( 'Y-m-d H:i (T)' );
		$log['site_url']  = get_option( 'siteurl' );
		$log['home_url']  = get_site_url();
		global $wp_version;
		$log['wpversion']  = $wp_version;
		$log['multisite']  = is_multisite();
		$log['phpversion'] = phpversion();
		$log['https']      = is_ssl();

		$log['settings']       = get_option( pwp_settings()->option_key );
		$log['active_plugins'] = [];
		foreach ( get_option( 'active_plugins' ) as $plugin ) {
			$log['active_plugins'][ $plugin ] = get_plugin_data( ABSPATH . 'wp-content/plugins/' . $plugin );
		}

		$theme               = wp_get_theme();
		$log['active_theme'] = [
			'name'           => $theme->get( 'Name' ),
			'author'         => $theme->get( 'Author' ),
			'authoruri'      => $theme->get( 'AuthorURI' ),
			'version'        => $theme->get( 'Version' ),
			'template_dir'   => get_template_directory(),
			'stylesheet_dir' => get_stylesheet_directory(),
		];

		$file = 'debug_log_' . time() . '.json';
		$put  = pwp_put_contents( $this->upload_dir . $file, json_encode( $log ) );
		if ( ! $put ) {
			return false;
		}

		return $this->upload_url . $file;
	}

	public function get_icon( $key ) {
		$icon_path = plugin_dir_path( pwp_get_instance()->file ) . "assets/img/icon/$key.svg";
		if ( file_exists( $icon_path ) ) {
			return file_get_contents( $icon_path );
		}

		return false;
	}

	public static function empty_dir( $dir ) {
		if ( ! is_dir( $dir ) ) {
			throw new InvalidArgumentException( "$dir must be a directory" );
		}
		if ( substr( $dir, strlen( $dir ) - 1, 1 ) != '/' ) {
			$dir .= '/';
		}
		$files = glob( $dir . '*', GLOB_MARK );
		foreach ( $files as $file ) {
			if ( is_dir( $file ) ) {
				self::empty_dir( $file );
			} else {
				unlink( $file );
			}
		}
		rmdir( $dir );
	}
}
