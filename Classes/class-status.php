<?php

namespace nicomartin\ProgressiveWordPress;

class Status {

	public $upload_dir = '';
	public $upload_url = '';

	public function __construct() {

		$this->upload_dir = pwp_get_instance()->upload_dir . '/debug/';
		$this->upload_url = pwp_get_instance()->upload_url . '/debug/';
	}

	public function run() {

		/**
		 * Page
		 */

		add_action( 'pwp_settings', [ $this, 'settings_stats' ] );
		add_action( 'pwp_settings', [ $this, 'settings_logs' ] );

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
	}

	public function settings_logs() {

		// translators: Please make sure your device supports progressive web apps and the status above is green.
		$html = sprintf( __( 'Please make sure the status above is all green and your device supports %s.', 'pwp' ), '<a href="https://caniuse.com/#feat=serviceworkers" target="_blank">Progressive Web Apps</a>' ) . '<br>';
		// translators: Still not working? Please visit the support forum.
		$html .= sprintf( __( 'Still not working? Please visit the %s.', 'pwp' ), '<a href="https://wordpress.org/support/plugin/progressive-wp/" target="_blank">' . __( 'support forum', 'pwp' ) . '</a>' );
		$html .= '<br><br><small><b>' . __( 'Attention!', 'pwp' ) . '</b> ' . __( 'The Debug Log contains information that should not be public.', 'pwp' ) . '</small>';

		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_help', __( 'Need Help?', 'pwp' ), '<p>' . $html . '</p>' );

		$html = '<button class="button pwp-download-log" data-log="debug-log">' . __( 'Download Logfile', 'pwp' ) . '</button>';
		pwp_settings()->add_message( $section, 'pwp_intro_logs_debug', __( 'Debug Log', 'pwp' ), $html );
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
			pwp_exit_ajax( 'error', __( 'Logfile could not be created', 'pwp' ) );
		}

		pwp_exit_ajax( 'error', __( 'Error', 'pwp' ) );
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
		$log['home_url']  = get_home_url();
		global $wp_version;
		$log['wpversion']  = $wp_version;
		$log['multisite']  = is_multisite();
		$log['phpversion'] = phpversion();

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
