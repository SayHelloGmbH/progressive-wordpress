<?php

namespace nicomartin\ProgressiveWordPress;

class AdminPage {
	public $capability = '';
	public $settings_parent = '';
	//public $adminBarId = '';
	public $menu_title = '';
	public $menu_items = [];

	public function __construct() {
		$this->capability      = 'administrator';
		$this->settings_parent = pwp_get_instance()->prefix . '-settings';
		//$this->adminBarId     = pwp_get_instance()->prefix . '-admin-bar';
		$this->menu_title = __( 'Progressive WP', 'progressive-wp' );
		$this->menu_items = [
			'about'    => __( 'About', 'progressive-wp' ),
			'manifest' => __( 'Add to Homescreen', 'progressive-wp' ),
		];
	}

	public function run() {
		add_action( 'admin_menu', [ $this, 'menu' ] );
	}

	public function menu() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, $this->settings_parent, function () {
			?>
			<div class="wrap pwp-wrap mainpage-wrap">
				<h1><?php echo $this->menu_title; ?></h1>
				<div id="pwp-app"></div>
			</div>
			<?php
		}, $icon, 100 );
	}
}
