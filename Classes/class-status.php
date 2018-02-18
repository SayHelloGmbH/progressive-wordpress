<?php

namespace nicomartin\ProgressiveWordPress;

class Status {

	public $logtypes = '';
	public $upload_dir = '';
	public $upload_url = '';

	public function __construct() {
		$this->logtypes   = [ 'debug-log' ];
		$this->upload_dir = wp_upload_dir()['basedir'] . '/progressive-wp/';
		$this->upload_url = wp_upload_dir()['baseurl'] . '/progressive-wp/';
	}

	public function run() {

		if ( ! is_dir( $this->upload_dir ) ) {
			mkdir( $this->upload_dir );
		}

		/**
		 * Page
		 */

		add_action( 'pwp_settings', [ $this, 'settings_stats' ] );
		add_action( 'pwp_settings', [ $this, 'settings_logs' ] );

		/**
		 * Ajax
		 */

		add_action( 'wp_ajax_pwp_ajax_download_log', [ $this, 'download_log' ] );

	}

	/**
	 * Page
	 */

	public function settings_stats() {
		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_stats', __( 'Status', 'pwp' ) );

		$check = $this->get_stats();

		foreach ( $check as $key => $vals ) {
			$html       = '';
			$icon_check = $this->get_icon( 'check' );
			$icon_close = $this->get_icon( 'close' );

			if ( $vals['true'] ) {
				$html .= "<span class='pwp-status pwp-status--success'><span class='pwp-status__icon'>$icon_check</span>{$vals['text_true']}</span>";
			} else {
				$html .= "<span class='pwp-status pwp-status--error'><span class='pwp-status__icon'>$icon_close</span>{$vals['text_false']}</span>";
			}
			pwp_settings()->add_message( $section, "pwp_intro_stats_$key", $vals['title'], $html );
		}

		pwp_settings()->add_checkbox( $section, 'pwp-force-deregister-sw', __( 'Unregister all other serviceworkers', 'pwp' ), false );

	}

	public function settings_logs() {
		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_logs', __( 'Logs', 'pwp' ) );

		$html = '<button class="button pwp-download-log" data-log="debug-log">' . __( 'Download Logfile', 'pwp' ) . '</button>';
		pwp_settings()->add_message( $section, 'pwp_intro_logs_debug', __( 'Debug Log', 'pwp' ), $html );

	}

	/**
	 * Ajax
	 */

	public function download_log() {

		if ( ! in_array( $_POST['logtype'], $this->logtypes ) ) {
			pwp_exit_ajax( 'error', __( 'Error', 'pwp' ) );
		}

		if ( 'debug-log' == $_POST['logtype'] ) {
			$log = $this->generate_debug_log();
			if ( $log ) {
				pwp_exit_ajax( 'success', $log );
			} else {
				pwp_exit_ajax( 'error', __( 'Logfile could not be created', 'pwp' ) );
			}
		}

		pwp_exit_ajax( 'error', 'ok' );
	}

	/**
	 * Helpers
	 */

	public function generate_debug_log() {

		$log             = [];
		$log['site_url'] = get_option( 'siteurl' );
		$log['home_url'] = get_home_url();

		$log['stats'] = [];
		$stats        = $this->get_stats();
		foreach ( $stats as $key => $vals ) {
			$log['stats'][ $key ] = $vals['true'];
		}

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

		$log['multisite'] = is_multisite();

		$file = 'debug_log_' . time() . '.json';
		$put  = file_put_contents( $this->upload_dir . $file, json_encode( $log ) );
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

	public function get_stats() {
		return [
			'manifest'     => [
				'title'      => __( 'Manifest', 'pwp' ),
				'true'       => file_exists( pwp_get_instance()->Manifest->manifest_path ),
				'text_true'  => __( 'Manifest generated successfully.', 'pwp' ),
				'text_false' => __( 'Manifest not generated.', 'pwp' ),
			],
			'sw'           => [
				'title'      => __( 'ServiceWorker', 'pwp' ),
				'true'       => file_exists( pwp_get_instance()->Serviceworker->sw_path ),
				'text_true'  => __( 'ServiceWorker generated successfully.', 'pwp' ),
				'text_false' => __( 'ServiceWorker not generated.', 'pwp' ),
			],
			'rootwritable' => [
				'title'      => __( 'Root Folder', 'pwp' ),
				'true'       => is_writable( trailingslashit( ABSPATH ) ),
				'text_true'  => __( 'Root Folder is writable.', 'pwp' ),
				'text_false' => __( 'Root Folder is not writable.', 'pwp' ),
			],
			'https'        => [
				'title'      => __( 'HTTPS', 'pwp' ),
				'true'       => is_ssl(),
				'text_true'  => __( 'Your site is serverd over HTTPS.', 'pwp' ),
				'text_false' => __( 'Your site has to be served over HTTPS.', 'pwp' ),
			],
		];
	}
}
