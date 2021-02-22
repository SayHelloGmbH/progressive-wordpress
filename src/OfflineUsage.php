<?php

namespace nicomartin\ProgressiveWordPress;

class OfflineUsage
{
    public $strategies = [];
    public $routes = [];
    public $workboxVersion = '6.1.1';

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
        add_filter('pwp_serviceworker', [$this, 'serviceWorker']);
        add_filter('pwp_precache_urls', [$this, 'precacheUrlsFromSettings']);
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
        $site_url = preg_quote(get_site_url(), '/');

        return apply_filters('pwp_offline_routes', [
            'static'  => [
                'name'    => __('Caching strategy for CSS and JS Files', 'progressive-wp'),
                'regex'   => $site_url . '.*\.(css|js)',
                'default' => 'staleWhileRevalidate',
            ],
            'images'  => [
                'name'    => __('Caching strategy for images', 'progressive-wp'),
                'regex'   => $site_url . '.*\.(png|jpg|jpeg|gif|ico)',
                'default' => 'cacheFirst',
            ],
            'fonts'   => [
                'name'    => __('Caching strategy for fonts', 'progressive-wp'),
                'regex'   => $site_url . '.*\.(woff|eot|woff2|ttf|svg)',
                'default' => 'cacheFirst',
            ],
            'default'    => [
                'name'    => __('Caching strategy for WP Rest', 'progressive-wp'),
                'regex'   => $site_url . '.*',
                'default' => 'networkOnly',
            ],
        ]);
    }

    public function serviceWorker()
    {
        /**
         * register workbox
         */

        $path        = "assets/dist/workbox/workbox-v{$this->workboxVersion}/";
        $workbox_dir = trailingslashit(plugin_dir_url(pwpGetInstance()->file)) . $path;
        echo sprintf("importScripts( %s );\n", wp_json_encode("{$workbox_dir}workbox-sw.js"));

        $options = [
            'debug'            => pwpGetInstance()->debug,
            'modulePathPrefix' => $workbox_dir,
        ];
        echo sprintf("workbox.setConfig( %s );\n", wp_json_encode($options));

        /**
         * add precaching
         */

        echo "workbox.loadModule('workbox-precaching');\n";

        $precache_urls   = apply_filters('pwp_precache_urls', ['/']);
        $precache_routes = array_map(function ($url) {
            return [
                'url'      => $url,
                'revision' => null,
            ];
        }, $precache_urls);

        echo sprintf("workbox.precaching.precacheAndRoute( %s );\n", wp_json_encode($precache_routes));

        /**
         * add runtime caching
         */

        echo "workbox.loadModule('workbox-routing');\n";
        echo "workbox.loadModule('workbox-strategies');\n";
        echo "workbox.routing.registerRoute(new RegExp('\/wp-admin(.*)|(.*)preview=true(.*)\/'), new workbox.strategies.NetworkOnly());\n";
        foreach ($this->getOfflineRoutes() as $key => $route) {
            $strategy = ucfirst(pwpGetInstance()->Settings->getSingleSettingValue("offline-strategy-${key}"));
            echo "workbox.routing.registerRoute(new RegExp('{$route['regex']}'), new workbox.strategies.{$strategy}({ cacheName: 'pwp-{$key}'}));\n";
        }
    }

    public function precacheUrlsFromSettings($urls)
    {
        return array_merge($urls, explode("\n", pwpGetInstance()->Settings->getSingleSettingValue('offline-content')));
    }
}
