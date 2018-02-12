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
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'pwp_basics_section', [ $this, 'intro_text' ], 1 );

		// Assets
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );

		// Helper
		add_action( 'wp_footer', [ $this, 'footer_js' ], 1 );
		add_action( 'admin_footer', [ $this, 'admin_footer_js' ], 1 );
	}

	/**
	 * Basics Page
	 */
	public function add_menu_page() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, PWP_SETTINGS_PARENT, '', $icon, 100 );
		add_submenu_page( PWP_SETTINGS_PARENT, __( 'About', 'pwp' ), __( 'About', 'pwp' ), $this->capability, PWP_SETTINGS_PARENT, [ $this, 'basics_menu_page' ] );
	}

	public function basics_menu_page() {
		?>
		<div class="wrap pwp-wrap">
			<h1><?php echo pwp_get_instance()->name; ?></h1>
			<div class="pwp-wrap__content">
				<?php do_action( 'pwp_basics_section' ); ?>
			</div>
		</div>
		<?php
	}

	public function intro_text() {
		echo '<div class="pwp-wrap__section">';
		// translators: Thank you for using plugin_name
		echo '<p><b>' . sprintf( __( 'Thank you for using %s!', 'pwp' ), pwp_get_instance()->name ) . '</b></p>';
		echo '<p>';
		// translators: Why it was developed.
		echo sprintf( __( 'This plugin was developed by %s to use progressive web app features for your WordPress wesbsite.', 'pwp' ), '<a href="https://nicomartin.ch" target="_blank">Nico Martin</a>' );
		echo '</p><p>';
		// translators: feature 1
		echo __( 'You are able to create a web-app-manifest, which makes your website installable.', 'pwp' );
		// translators: feature 2
		echo '<br>' . __( 'It also enables offline usage and in the future you will even be able to send push notifications!', 'pwp' );
		echo '</p>';
		$sw_link = 'https://caniuse.com/#feat=serviceworkers';
		echo '<p><b>' . __( 'To deliver app-like features this plugin uses a serviceworker.js file. This technology is not yet supported in all browsers!', 'pwp' ) . '</b><br><a href="' . $sw_link . '" target="_blank">' . $sw_link . '</a></p>';
		$buyabeer = '<a href="https://www.paypal.me/NicoMartin" target="_blank">' . __( 'buy me a beer', 'pwp' ) . '</a>';
		$github   = '<a href="https://github.com/nico-martin/progressive-wordpress" target="_blank">GitHub</a>';
		// translators: If you like this plugin feel free to buy me a beer or get involved in the development on GitHub
		echo '<p>' . sprintf( __( 'If you like this plugin feel free to %1$s or get involved with the development on %2$s', 'pwp' ), $buyabeer, $github ) . '</p>';
		echo '</div>';
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
}
