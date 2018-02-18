<?php

namespace nicomartin\ProgressiveWordPress;

class Init {
	public $capability = '';
	public $admin_bar_id = '';
	public $menu_title = '';

	public function __construct() {
		$this->capability   = 'administrator';
		$this->admin_bar_id = pwp_get_instance()->prefix . '-admin-bar';
		$this->menu_title   = __( 'Progressive WP', 'pwp' );
	}

	public function run() {
		// Basics Page
		add_action( 'pwp_settings', [ $this, 'settings_intro' ] );
		add_action( 'pwp_settings', [ $this, 'settings_stats' ] );
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );

		// Assets
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );

		// Helper
		add_action( 'wp_footer', [ $this, 'footer_js' ], 1 );
		add_action( 'admin_footer', [ $this, 'admin_footer_js' ], 1 );

		// is_ssl() fix for cloudflare: https://snippets.webaware.com.au/snippets/wordpress-is_ssl-doesnt-work-behind-some-load-balancers/
		if ( stripos( get_option( 'siteurl' ), 'https://' ) === 0 ) {
			$_SERVER['HTTPS'] = 'on';
		}
	}

	/**
	 * Basics Page
	 */

	public function settings_intro() {
		$html = '';
		// translators: Thank you for using plugin_name
		$html .= '<p><b>' . sprintf( __( 'Thank you for using %s!', 'pwp' ), pwp_get_instance()->name ) . '</b></p>';
		$html .= '<p>';
		// translators: Why it was developed.
		$html .= sprintf( __( 'This plugin was developed by %s to use progressive web app features for your WordPress wesbsite.', 'pwp' ), '<a href="https://nicomartin.ch" target="_blank">Nico Martin</a>' );
		$html .= '</p><p>';
		// translators: feature 1
		$html .= __( 'You are able to create a web-app-manifest, which makes your website installable.', 'pwp' );
		// translators: feature 2
		$html     .= '<br>' . __( 'It also enables offline usage and in the future you will even be able to send push notifications!', 'pwp' );
		$html     .= '</p>';
		$sw_link  = 'https://caniuse.com/#feat=serviceworkers';
		$html     .= '<p><b>' . __( 'To deliver app-like features this plugin uses a serviceworker.js file. This technology is not yet supported in all browsers!', 'pwp' ) . '</b><br><a href="' . $sw_link . '" target="_blank">' . $sw_link . '</a></p>';
		$buyabeer = '<a href="https://www.paypal.me/NicoMartin" target="_blank">' . __( 'buy me a beer', 'pwp' ) . '</a>';
		$github   = '<a href="https://github.com/nico-martin/progressive-wordpress" target="_blank">GitHub</a>';
		// translators: If you like this plugin feel free to buy me a beer or get involved in the development on GitHub
		$html .= '<p>' . sprintf( __( 'If you like this plugin feel free to %1$s or get involved with the development on %2$s', 'pwp' ), $buyabeer, $github ) . '</p>';

		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_text', '', $html );
	}


	public function settings_stats() {
		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_stats', __( 'Status', 'pwp' ) );

		$check = [
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

	public function add_menu_page() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, PWP_SETTINGS_PARENT, '', $icon, 100 );
	}

	/**
	 * Assets
	 */
	public function add_assets() {
		$script_version = pwp_get_instance()->version;
		$min            = true;
		if ( pwp_get_instance()->debug && is_user_logged_in() ) {
			$min = false;
		}
		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_style( pwp_get_instance()->prefix . '-style', $dir_uri . 'assets/styles/ui' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-script', $dir_uri . 'assets/scripts/ui' . ( $min ? '.min' : '' ) . '.js', [ 'jquery' ], $script_version, true );
	}

	public function add_admin_assets() {
		$script_version = pwp_get_instance()->version;
		$min            = true;
		if ( pwp_get_instance()->debug && is_user_logged_in() ) {
			$min = false;
		}
		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_style( pwp_get_instance()->prefix . '-admin-style', $dir_uri . 'assets/styles/admin' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-admin-script', $dir_uri . 'assets/scripts/admin' . ( $min ? '.min' : '' ) . '.js', [ 'jquery' ], $script_version, true );
	}

	/**
	 * Helper
	 */
	public function footer_js() {
		$defaults = [
			'AjaxURL' => admin_url( 'admin-ajax.php' ),
			'homeurl' => trailingslashit( get_home_url() ),
		];

		$vars = apply_filters( 'pwp_footer_js', $defaults );

		echo "<script id='pwp-js-vars'>\r\n";
		echo 'var PwpJsVars = ' . json_encode( $vars );
		echo '</script>';
	}

	public function admin_footer_js() {
		$defaults = [
			'AjaxURL'      => admin_url( 'admin-ajax.php' ),
			'homeurl'      => trailingslashit( get_home_url() ),
			'GeneralError' => __( 'An unexpected error occured', 'pwp' ),
		];

		$vars = apply_filters( 'pwp_admin_footer_js', $defaults );

		echo "<script id='pwp-js-vars'>\r\n";
		echo 'var PwpJsVars = ' . json_encode( $vars );
		echo '</script>';
	}

	public function get_icon( $key ) {
		$icon_path = plugin_dir_path( pwp_get_instance()->file ) . "assets/img/icon/$key.svg";
		if ( file_exists( $icon_path ) ) {
			return file_get_contents( $icon_path );
		}

		return false;
	}
}
