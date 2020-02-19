<?php

namespace nicomartin\ProgressiveWordPress;

class Offlineusage {

	public $capability = '';
	public $indicator_text = '';
	public $routes = [];
	public $strategies = [];

	public function __construct() {
		$this->capability     = pwp_get_instance()->Init->capability;
		$this->indicator_text = 'you\'re currently offline';
		$this->routes         = [];

		$this->strategies = [
			'staleWhileRevalidate' => __( 'Stale While Revalidate', 'progressive-wp' ),
			'networkFirst'         => __( 'Network First', 'progressive-wp' ),
			'cacheFirst'           => __( 'Cache First', 'progressive-wp' ),
			'networkOnly'          => __( 'Network Only', 'progressive-wp' ),
		];
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_filter( pwp_settings()->sanitize_filter . '_offline-content', [ $this, 'sanitize_offline_content' ] );
		//add_filter( 'pwp_sw_content', [ $this, 'sw_content' ] );
		add_action( 'pwp_settings', [ $this, 'offline_indicator_settings' ] );
		add_action( 'wp_footer', [ $this, 'offline_indicator_template' ] );
		add_action( 'setup_theme', [ $this, 'offline_routes_populate' ] );

		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_frontpage' ], 2 );
		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_offlinepage' ], 4 );
		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_settingspage' ], 6 );
		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_amp' ], 6 );
		add_action( 'pwp_serviceworker', [ $this, 'get_sw_content' ] );
	}

	public function settings() {

		$section_desc = __( 'This feature allows you to provide offline usage for your website.', 'progressive-wp' ) . '<br>';
		$section_desc .= __( 'By default, a copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline. The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache. Additionally, you can define other pre-cached resources using the "offline content" textarea.', 'progressive-wp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineusage', __( 'Offline Usage', 'progressive-wp' ), $section_desc );

		$choices = [];
		foreach ( get_pages() as $post ) {
			if ( get_option( 'page_on_front' ) == $post->ID ) {
				continue;
			}
			$choices[ $post->ID ] = get_the_title( $post );
		}
		pwp_settings()->add_select( $section, 'offline-page', __( 'Offline fallback Page', 'progressive-wp' ), $choices, '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'This page should contain a message explaining why the requested content is not available.', 'progressive-wp' ) . '</p>',
		] );

		$text = __( 'Pages and files that should be saved for offline usage on first interaction. One URL per line.', 'progressive-wp' ) . '<br>';
		// translators: Every URL has to start with: [home_url]
		$text .= sprintf( __( 'Every URL has to start with: %1$s', 'progressive-wp' ), '<code>' . untrailingslashit( get_site_url() ) . '</code>' );

		pwp_settings()->add_textarea( $section, 'offline-content', __( 'Offline Content', 'progressive-wp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . $text . '</p>',
		] );

		pwp_settings()->add_checkbox( $section, 'offline-analytics', __( 'Offline Google Analytics', 'progressive-wp' ), false, [
			'after_field' => '<p class="pwp-smaller">' . __( 'If the user is offline, analytics data can\'t be sent to google analytcs. This option will store the data and sync them as soon as the user is online again.', 'progressive-wp' ) . '</p>',
		] );

		$section_desc = __( 'All network requests are cached by progressive WordPress. Here you are able to manually change the caching strategy for some request types.', 'progressive-wp' ) . '<br>';
		$section_desc .= '<ul>';
		$section_desc .= '<li><b>' . __( 'Stale While Revalidate', 'progressive-wp' ) . ':</b> ' . __( 'This strategy will use a cached response for a request if it is available and update the cache in the background with a response form the network. (If it’s not cached it will wait for the network response and use that). This is a fairly safe strategy as it means users are regularly updating their cache. The downside of this strategy is that it’s always requesting an asset from the network, using up the user’s bandwidth.', 'progressive-wp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Network First', 'progressive-wp' ) . ':</b> ' . __( 'This will try and get a request from the network first. If it receives a response, it’ll pass that to the browser and also save it to a cache. If the network request fails, the last cached response will be used.', 'progressive-wp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Cache First', 'progressive-wp' ) . ':</b> ' . __( 'This strategy will check the cache for a response first and use that if one is available. If the request isn’t in the cache, the network will be used and any valid response will be added to the cache before being passed to the browser.', 'progressive-wp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Network Only', 'progressive-wp' ) . ':</b> ' . __( 'This strategy won\'t chache anything. The network will be used and the response will be passed directly to the browser (That\'s how the browser would handle the request without the Service Worker).', 'progressive-wp' ) . '</li>';
		$section_desc .= '</ul>';
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlinestrategies', __( 'Caching strategies', 'progressive-wp' ), $section_desc );

		foreach ( $this->routes as $key => $values ) {
			pwp_settings()->add_select( $section, 'offline-strategy-' . $key, $values['name'], $this->strategies, $values['default'] );
		}
	}

	public function sanitize_offline_content( $content ) {
		$files = explode( "\n", $content );
		if ( ! is_array( $files ) ) {
			return $files;
		}

		$new_files = [];
		foreach ( $files as $key => $file ) {

			$file     = esc_url( $file );
			$home_url = untrailingslashit( get_site_url() );

			if ( strpos( $file, $home_url ) === 0 ) {
				$new_files[] = $file;
			}
		}

		return implode( "\n", $new_files );
	}

	public function offline_indicator_settings() {
		$section_desc = __( 'This adds a little notice which will be displayed if the device is offline.', 'progressive-wp' ) . '<br>';
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineindicator', __( 'offline indicator  ', 'progressive-wp' ), $section_desc );
		pwp_settings()->add_checkbox( $section, 'offline-indicator', __( 'Offline indicator', 'progressive-wp' ), false );
		pwp_settings()->add_input( $section, 'offline-indicator-text', __( 'Message', 'progressive-wp' ), $this->indicator_text );
		pwp_settings()->add_select( $section, 'offline-indicator-position', __( 'Position', 'progressive-wp' ), [
			'bottom' => __( 'Bottom', 'progressive-wp' ),
			'top'    => __( 'Top', 'progressive-wp' ),
		], 'bottom' );

		pwp_settings()->add_color( $section, 'offline-indicator-color-text', __( 'Textcolor', 'progressive-wp' ), '#ffffff' );
		pwp_settings()->add_color( $section, 'offline-indicator-color-background', __( 'Background-Color', 'progressive-wp' ), '#000000' );
	}

	public function offline_indicator_template() {

		$indicator = pwp_settings()->get_setting( 'offline-indicator' );

		if ( ! $indicator ) {
			return;
		}

		$text     = pwp_settings()->get_setting( 'offline-indicator-text' );
		$position = pwp_settings()->get_setting( 'offline-indicator-position' );

		$textcolor = pwp_settings()->get_setting( 'offline-indicator-color-text' );
		$bkgcolor  = pwp_settings()->get_setting( 'offline-indicator-color-background' );

		echo "<div class='offline-indicator offline-indicator--$position' style='background-color: $bkgcolor'>";
		echo "<p style='color:$textcolor'>$text</p>";
		echo '</div>';

	}

	public function offline_routes_populate() {
		$this->routes = apply_filters( 'pwp_offline_routes', [
			'default' => [
				'name'    => __( 'Default caching strategy', 'progressive-wp' ),
				'regex'   => get_site_url() . '.*',
				'default' => 'networkFirst',
			],
			'static'  => [
				'name'    => __( 'Caching strategy for CSS and JS Files', 'progressive-wp' ),
				'regex'   => get_site_url() . '.*\.(css|js)',
				'default' => 'staleWhileRevalidate',
			],
			'images'  => [
				'name'    => __( 'Caching strategy for images', 'progressive-wp' ),
				'regex'   => get_site_url() . '.*\.(png|jpg|jpeg|gif|ico)',
				'default' => 'cacheFirst',
			],
			'fonts'   => [
				'name'    => __( 'Caching strategy for fonts', 'progressive-wp' ),
				'regex'   => get_site_url() . '.*\.(woff|eot|woff2|ttf|svg)',
				'default' => 'cacheFirst',
			],
			'rest'    => [
				'name'    => __( 'Caching strategy for WP Rest', 'progressive-wp' ),
				'regex'   => get_rest_url() . '.*',
				'default' => 'networkOnly',
			],
		] );
	}

	public function pre_cache_frontpage( $caches ) {
		$caches[] = get_site_url();

		return $caches;
	}

	public function pre_cache_offlinepage( $caches ) {
		foreach ( explode( "\n", pwp_get_setting( 'offline-content' ) ) as $url ) {
			$caches[] = $url;
		}

		return $caches;
	}

	public function pre_cache_settingspage( $caches ) {
		if ( 'page' == get_post_type( pwp_get_setting( 'offline-page' ) ) ) {
			$offline_url = get_permalink( pwp_get_setting( 'offline-page' ) );
			$caches[]    = $offline_url;
		}

		return $caches;
	}

	public function pre_cache_amp( $caches ) {
		if ( pwp_supports_amp() ) {
			$caches[] = 'https://cdn.ampproject.org/v0.js';
			$caches[] = 'https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js';
			$caches[] = 'https://cdn.ampproject.org/shadow-v0.js';
		}

		return $caches;
	}

	public function get_sw_content() {

		$plugin_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		$pre_cache  = json_encode( apply_filters( 'pwp_offline_precache', [] ) );

		$c = '';
		$c .= 'importScripts(\'' . $plugin_uri . 'assets/workbox-v3.4.1/workbox-sw.js\');';
		$c .= "\nif (workbox) {\n";
		//$c .= "\nworkbox.setConfig({debug: true});\n";
		$c .= "workbox.precaching.precache({$pre_cache});\n";
		$c .= "workbox.routing.registerRoute(/wp-admin(.*)|wp-json(.*)|(.*)preview=true(.*)/, workbox.strategies.networkOnly());\n";

		// AMP
		if ( pwp_supports_amp() ) {
			$c .= "workbox.routing.registerRoute(/(.*)cdn\.ampproject\.org(.*)/, workbox.strategies.staleWhileRevalidate({cacheName: PwpSwVersion + '-amp'}));\n";
		}
		// Google Fonts
		$c .= "workbox.routing.registerRoute(/(.*)fonts\.googleapis\.com(.*)/, workbox.strategies.staleWhileRevalidate({cacheName: PwpSwVersion + '-google-fonts'}));\n";
		$c .= "workbox.routing.registerRoute(/(.*)fonts\.gstatic\.com(.*)/, workbox.strategies.cacheFirst({cacheName: PwpSwVersion + '-google-fonts'}));\n";
		// Gravatar
		$c .= "workbox.routing.registerRoute(/(.*)secure\.gravatar\.com(.*)/, workbox.strategies.staleWhileRevalidate({cacheName: PwpSwVersion + '-gravatar'}));\n";
		foreach ( array_reverse( $this->routes, true ) as $key => $values ) {
			$strategy = pwp_get_setting( 'offline-strategy-' . $key );
			if ( 'default' == $key && 'page' == get_post_type( pwp_get_setting( 'offline-page' ) ) ) {
				$offline_url = get_permalink( pwp_get_setting( 'offline-page' ) );

				//$c .= "const handler = (args) => workbox.strategies.{$strategy}({ cacheName: PwpSwVersion + '-{$key}'}).handle(args).then((response) => {console.log(response);if(!response) { caches.match('{$offline_url}'); }else{ response;}});\n";
				//$c .= "workbox.routing.registerRoute(new RegExp('{$values['regex']}'), handler);\n";
				$c .= "workbox.routing.registerRoute(
					new RegExp('{$values['regex']}'),
					async (args) => {
						try {
							const response = await workbox.strategies.{$strategy}({ cacheName: PwpSwVersion + '-{$key}'}).handle(args);
							return response || await caches.match('{$offline_url}');
						} catch (error) {
							console.log('catch:',error);
							return await caches.match('{$offline_url}');
						}
					}
				);";
			} else {
				$c .= "workbox.routing.registerRoute( new RegExp('{$values['regex']}'), workbox.strategies.{$strategy}({ cacheName: PwpSwVersion + '-{$key}'}) );\n";
			}
		}

		if ( pwp_get_setting( 'offline-analytics' ) ) {
			$c .= "workbox.googleAnalytics.initialize();\n";
		}
		$c .= "}\n\n";

		$delete_file = plugin_dir_path( pwp_get_instance()->file ) . '/assets/serviceworker/delete-cache.js';
		if ( file_exists( $delete_file ) ) {
			$c .= file_get_contents( $delete_file );
		}

		$cache_hash    = hash( 'crc32', $c, false );
		$cache_version = "pwp-{$cache_hash}";

		$path = plugin_dir_path( pwp_get_instance()->file ) . 'Classes/Libs';
		require_once $path . '/minify/autoload.php';
		require_once $path . '/path-converter/autoload.php';
		$minifier = new \MatthiasMullie\Minify\JS( $c );
		$c        = $minifier->minify();

		echo "( function() {\nconst PwpSwVersion = '{$cache_version}';\n" . $c . "\n} )();";
	}
}
