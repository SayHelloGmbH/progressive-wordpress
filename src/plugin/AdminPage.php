<?php

namespace nicomartin\ProgressiveWordPress;

class AdminPage
{
    public $capability = '';
    public $settings_parent = '';
    public $menu_title = '';

    public function __construct()
    {
        $this->capability      = 'administrator';
        $this->settings_parent = pwpGetInstance()->prefix . '-settings';
        $this->menu_title      = __('Progressive WP', 'progressive-wp');
    }

    public function run()
    {
        add_action('admin_menu', [$this, 'menu']);
    }

    public function menu()
    {
        $icon = plugin_dir_url(pwpGetInstance()->file) . '/assets/img/pwa-menu-icon.png';
        add_menu_page(
            pwpGetInstance()->name,
            $this->menu_title,
            $this->capability,
            $this->settings_parent,
            function () {
                ?>
                <div id="pwp-app"></div>
                <div id="pwp-shadowbox"></div>
                <?php
            },
            $icon,
            100
        );
    }
}
