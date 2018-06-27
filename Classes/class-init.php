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
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );

		// Assets
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );

		// is_ssl() fix for cloudflare: https://snippets.webaware.com.au/snippets/wordpress-is_ssl-doesnt-work-behind-some-load-balancers/
		if ( stripos( get_option( 'siteurl' ), 'https://' ) === 0 ) {
			$_SERVER['HTTPS'] = 'on';
		}

		/**
		 * Default Settings
		 */
		add_action( 'pwp_on_activate', [ $this, 'default_settings' ] );
		//add_action( 'init', [ $this, 'default_settings' ] );
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
		$html .= sprintf( __( 'This plugin was developed by %s to use progressive web app features for your WordPress website.', 'pwp' ), '<a href="https://nicomartin.ch" target="_blank">Nico Martin</a>' );
		$html .= '</p><p>';
		// translators: feature 1
		$html .= __( 'You are able to create a web-app-manifest, which makes your website installable.', 'pwp' );
		// translators: feature 2
		$html     .= '<br>' . __( 'It also enables offline usage and you are able to send push notifications!', 'pwp' );
		$html     .= '</p>';
		$sw_link  = 'https://caniuse.com/#feat=serviceworkers';
		$html     .= '<p><b>' . __( 'To deliver app-like features this plugin uses a serviceworker.js file. This technology is not yet supported in all browsers!', 'pwp' ) . '</b><br><a href="' . $sw_link . '" target="_blank">' . $sw_link . '</a></p>';
		$buyabeer = '<a href="https://www.paypal.me/NicoMartin" target="_blank">' . __( 'buy me a beer', 'pwp' ) . '</a>';
		$github   = '<a href="https://github.com/nico-martin/progressive-wordpress" target="_blank">GitHub</a>';
		// translators: If you like this plugin feel free to buy me a beer or get involved in the development on GitHub
		$html .= '<p>' . sprintf( __( 'If you like this plugin feel free to %1$s or get involved with the development on %2$s', 'pwp' ), $buyabeer, $github ) . '</p>';

		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_text', '', $html );
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
		if ( pwp_get_instance()->debug ) {
			$min = false;
		}
		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_script( 'clientjs', $dir_uri . 'assets/scripts/clientjs.min.js', [], '1.0.0', true );

		wp_enqueue_style( pwp_get_instance()->prefix . '-style', $dir_uri . 'assets/styles/ui' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-script', $dir_uri . 'assets/scripts/ui' . ( $min ? '.min' : '' ) . '.js', [ 'jquery', 'clientjs' ], $script_version, true );

		/**
		 * Footer JS
		 */

		$defaults = [
			'AjaxURL' => admin_url( 'admin-ajax.php' ),
			'homeurl' => trailingslashit( get_home_url() ),
		];

		$vars = json_encode( apply_filters( 'pwp_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-script', "var PwpJsVars = {$vars};", 'before' );
	}

	public function add_admin_assets() {
		$script_version = pwp_get_instance()->version;
		$min            = true;
		if ( pwp_get_instance()->debug && is_user_logged_in() ) {
			$min = false;
		}

		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker' );

		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_style( pwp_get_instance()->prefix . '-admin-style', $dir_uri . 'assets/styles/admin' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-admin-script', $dir_uri . 'assets/scripts/admin' . ( $min ? '.min' : '' ) . '.js', [ 'jquery' ], $script_version, true );

		/**
		 * Admin Footer JS
		 */

		$defaults = [
			'AjaxURL'      => admin_url( 'admin-ajax.php' ),
			'homeurl'      => trailingslashit( get_home_url() ),
			'GeneralError' => __( 'An unexpected error occured', 'pwp' ),
		];

		$vars = json_encode( apply_filters( 'pwp_admin_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-admin-script', "var PwpJsVars = {$vars};", 'before' );
	}

	/**
	 * Default Settings
	 */
	public function default_settings() {
		$options = get_option( pwp_settings()->option_key, false );
		if ( ! $options ) {
			update_option( pwp_settings()->option_key, [
				'installable-enabled'       => '1',
				'manifest-name'             => get_bloginfo( 'name' ),
				'manifest-short-name'       => str_replace( ' ', '', get_bloginfo( 'name' ) ),
				'manifest-starturl'         => './',
				'manifest-description'      => get_bloginfo( 'description' ),
				'manifest-display'          => 'standalone',
				'manifest-orientation'      => 'portrait',
				'manifest-theme-color'      => '#000000',
				'manifest-background-color' => '#ffffff',
				'offline-enabled'           => 1,
				'offline-content'           => '',
			] );
		}

		pwp_manifest_regenerate();
		pwp_serviceworker_regenerate();
	}
}
