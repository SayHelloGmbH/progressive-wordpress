<?php

namespace nicomartin\ProgressiveWordPress;

class AdminPage {
	public string $capability = '';
	public string $settingsParent = '';
	//public string $adminBarId = '';
	public string $menuTitle = '';
	public array $menuItems = [];

	public function __construct() {
		$this->capability     = 'administrator';
		$this->settingsParent = pwp_get_instance()->prefix . '-settings';
		//$this->adminBarId     = pwp_get_instance()->prefix . '-admin-bar';
		$this->menuTitle = __( 'Progressive WP', 'progressive-wp' );
		$this->menuItems = [
			'about'    => __( 'About', 'progressive-wp' ),
			'manifest' => __( 'Add to Homescreen', 'progressive-wp' ),
		];
	}

	public function run() {
		add_action( 'admin_menu', [ $this, 'menu' ] );
	}

	public function menu() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menuTitle, $this->capability, $this->settingsParent, function () {
			?>
            <div class="wrap pwp-wrap mainpage-wrap">
                <h1><?php echo $this->menuTitle; ?></h1>
                <div id="pwp-app"></div>
            </div>
			<?php
		}, $icon, 100 );
	}
}