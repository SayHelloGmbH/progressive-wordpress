<?php

namespace nicomartin\ProgressiveWordPress;

class OfflineUsage
{
    public $strategies = [];
    public $routes = [];

    public function __construct()
    {
        $this->strategies = [
            'staleWhileRevalidate' => __('Stale While Revalidate', 'progressive-wp'),
            'networkFirst'         => __('Network First', 'progressive-wp'),
            'cacheFirst'           => __('Cache First', 'progressive-wp'),
            'networkOnly'          => __('Network Only', 'progressive-wp'),
        ];
    }

    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_admin_footer_js', [$this, 'addPossibleStrategies']);
    }

    public function settings($settings)
    {

        $settings['offline-page'] = [
            'default'  => 'normal',
            'label'    => __('Offline fallback Page', 'progressive-wp'),
            'validate' => null,
            'values'   => Helpers::getPages(),
        ];

        $settings['offline-content'] = [
            'default'  => 'normal',
            'label'    => __('Offline Content', 'progressive-wp'),
            'validate' => null,
        ];

        foreach ($this->getOfflineRoutes() as $key => $route) {
            $settings["offline-strategy-${key}"] = [
                'default'  => $route['default'],
                'label'    => $route['name'],
                'validate' => null,
                'values'   => $this->strategies,
            ];
        }

        return $settings;
    }

    public function addPossibleStrategies($vars)
    {
        $vars['cachingStrategyRoutes'] = $this->getOfflineRoutes();
        $vars['cachingStrategies']     = $this->strategies;

        return $vars;
    }

    public function getOfflineRoutes()
    {
        return apply_filters('pwp_offline_routes', [
            'default' => [
                'name'    => __('Default caching strategy', 'progressive-wp'),
                'regex'   => get_site_url() . '.*',
                'default' => 'networkFirst',
            ],
            'static'  => [
                'name'    => __('Caching strategy for CSS and JS Files', 'progressive-wp'),
                'regex'   => get_site_url() . '.*\.(css|js)',
                'default' => 'staleWhileRevalidate',
            ],
            'images'  => [
                'name'    => __('Caching strategy for images', 'progressive-wp'),
                'regex'   => get_site_url() . '.*\.(png|jpg|jpeg|gif|ico)',
                'default' => 'cacheFirst',
            ],
            'fonts'   => [
                'name'    => __('Caching strategy for fonts', 'progressive-wp'),
                'regex'   => get_site_url() . '.*\.(woff|eot|woff2|ttf|svg)',
                'default' => 'cacheFirst',
            ],
            'rest'    => [
                'name'    => __('Caching strategy for WP Rest', 'progressive-wp'),
                'regex'   => get_rest_url() . '.*',
                'default' => 'networkOnly',
            ],
        ]);
    }
}
