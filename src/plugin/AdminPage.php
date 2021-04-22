<?php

namespace nicomartin\ProgressiveWordPress;

class AdminPage
{
    public $capability = '';
    public $settings_parent = '';
    public $menu_title = '';
    public $menu = [];

    public function __construct()
    {
        $this->capability      = 'administrator';
        $this->settings_parent = pwpGetInstance()->prefix . '-settings';
        $this->menu_title      = __('Progressive WP', 'progressive-wp');
        $this->menu            = [
            'settings'           => [
                'title'   => __('About', 'progressive-wp'),
                'visible' => true,
            ],
            'manifest'           => [
                'title'   => __('Add to Homescreen', 'progressive-wp'),
                'visible' => true,
            ],
            'offline'            => [
                'title'   => __('Offline usage', 'progressive-wp'),
                'visible' => true,
            ],
            'push'               => [
                'title'   => __('Push Notifications', 'progressive-wp'),
                'visible' => true,
            ],
            'push-subscriptions' => [
                'title'   => __('Push Subscriptions', 'progressive-wp'),
                'visible' => PushCredentialsWebPush::issetVapid(),
            ],
        ];
    }

    public function run()
    {
        add_action('admin_menu', [$this, 'menu']);
        add_filter('pwp_admin_footer_js', [$this, 'footerVars']);
    }

    public function menu()
    {
        $icon = plugin_dir_url(pwpGetInstance()->file) . '/assets/img/pwa-menu-icon.png';
        add_menu_page(
            pwpGetInstance()->name,
            $this->menu_title,
            $this->capability,
            $this->settings_parent,
            [$this, 'page'],
            $icon,
            100
        );

        foreach ($this->menu as $slug => $menuElment) {
            add_submenu_page(
                $this->settings_parent,
                $menuElment['title'],
                $menuElment['title'],
                $this->capability,
                pwpGetInstance()->prefix . '-' . $slug,
                [$this, 'page']
            );
        }
    }

    public function page()
    {
        ?>
      <div id="pwp-app"></div>
      <div id="pwp-shadowbox"></div>
        <?php
    }

    public function footerVars($vars)
    {
        $vars['settingsParentKey'] = $this->settings_parent;
        $vars['menu']              = $this->menu;
        $vars['adminUrl']          = get_admin_url();

        return $vars;
    }
}