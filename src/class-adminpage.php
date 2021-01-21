<?php

namespace nicomartin\ProgressiveWordPress;

class AdminPage {
  public $capability = '';
  public $settings_parent = '';
  public $menu_title = '';

  public function __construct() {
    $this->capability      = 'administrator';
    $this->settings_parent = pwp_get_instance()->prefix . '-settings';
    $this->menu_title      = pwp_get_instance()->name;
  }

  public function run() {
    add_action( 'admin_menu', [ $this, 'menu' ] );
  }

  public function menu() {
    add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, $this->settings_parent,
      function () {
        ?>
        <div id="pwp-app"></div>
        <?php
      }, 'dashicons-admin-settings', 100 );
  }
}
