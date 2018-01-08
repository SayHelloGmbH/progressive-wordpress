<?php

namespace nicomartin\ProgressiveWordPress;

class Init {
	public $capability = '';
	public $admin_bar_id = '';
	public $menu_title = '';

	public function __construct() {
		$this->capability   = 'administrator';
		$this->admin_bar_id = pwp_get_instance()->prefix . '-admin-bar';
		$this->menu_title   = __( 'WP Performance', 'awpp' );
	}

	public function run() {
		// Basics Page
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'pwp_basics_section', [ $this, 'intro_text' ], 1 );
		add_action( 'pwp_basics_section', [ $this, 'speed_test_link' ] );
		// Admin Bar
		add_action( 'admin_bar_menu', [ $this, 'add_toolbar' ], 90 );
		// Assets
		//add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );

		// Helper
		add_action( 'admin_footer', [ $this, 'admin_footer_js' ], 1 );
	}

	/**
	 * Basics Page
	 */
	public function add_menu_page() {
		$icon = 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( plugin_dir_path( pwp_get_instance()->file ) . '/assets/img/menu-icon.svg' ) );
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, PWP_SETTINGS_PARENT, '', $icon, 100 );
		add_submenu_page( PWP_SETTINGS_PARENT, __( 'Basics', 'awpp' ), __( 'Basics', 'awpp' ), $this->capability, PWP_SETTINGS_PARENT, [ $this, 'basics_menu_page' ] );
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
		echo '<p><b>' . sprintf( __( 'Thank you for using %s!', 'awpp' ), pwp_get_instance()->name ) . '</b></p>';
		echo '<p>';
		// translators: This Plugin was developed by Nico Martin to deliver the best pagespeed performance possible.
		echo sprintf( __( 'This Plugin was developed by %s to deliver the best pagespeed performance possible.', 'awpp' ), '<a href="https://niomartin.ch" target="_blank">Nico Martin</a> - <a href="https://sayhello.ch" target="_blank">Say Hello GmbH</a>' );
		echo '<br>' . __( 'In contrst to other performance Plugins, this one sets focus on HTTP/2 Standards (like Server Push and SPDY).', 'awpp' );
		echo '</p>';
		$buyabeer = '<a href="https://www.paypal.me/NicoMartin" target="_blank">' . __( 'buy me a beer', 'awpp' ) . '</a>';
		$github   = '<a href="https://github.com/nico-martin/Advanced-WPPerformance" target="_blank">GitHub</a>';
		// translators: If you like this Plugin feel free to buy me a beer or get involved in the development on GitHub
		echo '<p>' . sprintf( __( 'If you like this Plugin feel free to %1$s or get involved with the development on %2$s', 'awpp' ), $buyabeer, $github ) . '</p>';
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
	public function admin_footer_js() {
		$defaults = [
			'AjaxURL' => admin_url( 'admin-ajax.php' ),
			'homeurl' => trailingslashit( get_home_url() ),
		];

		$vars = apply_filters( 'pwp_admin_footer_js', $defaults );

		echo "<script id='pwp-js-vars'>\r\n";
		echo 'var PwpJsVars = ' . json_encode( $vars );
		echo '</script>';
	}
}
