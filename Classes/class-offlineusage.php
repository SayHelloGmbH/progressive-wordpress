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
		$this->routes         = [
			'default' => [
				'name'    => __( 'Default caching strategy', 'pwp' ),
				'regex'   => get_site_url() . '.*',
				'default' => 'networkFirst',
			],
			'static'  => [
				'name'    => __( 'Caching strategy for CSS and JS Files', 'pwp' ),
				'regex'   => get_site_url() . '.*\.(css|js)',
				'default' => 'staleWhileRevalidate',
			],
			'images'  => [
				'name'    => __( 'Caching strategy for images', 'pwp' ),
				'regex'   => get_site_url() . '.*\.(png|jpg|jpeg|gif)',
				'default' => 'cacheFirst',
			],
			'fonts'   => [
				'name'    => __( 'Caching strategy for fonts', 'pwp' ),
				'regex'   => get_site_url() . '.*\.(woff|eot|woff2|ttf|svg)',
				'default' => 'cacheFirst',
			],
		];

		$this->strategies = [
			'staleWhileRevalidate' => __( 'Stale While Revalidate', 'pwp' ),
			'networkFirst'         => __( 'Network First', 'pwp' ),
			'cacheFirst'           => __( 'Cache First', 'pwp' ),
		];
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_filter( pwp_settings()->sanitize_filter . '_offline-content', [ $this, 'sanitize_offline_content' ] );
		//add_filter( 'pwp_sw_content', [ $this, 'sw_content' ] );
		add_action( 'pwp_settings', [ $this, 'offline_indicator_settings' ] );
		add_action( 'wp_footer', [ $this, 'offline_indicator_template' ] );

		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_frontpage' ], 2 );
		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_offlinepage' ], 4 );
		add_filter( 'pwp_offline_precache', [ $this, 'pre_cache_settingspage' ], 6 );
	}

	public function settings() {

		$section_desc = __( 'This feature allows you to provide offline usage for your website.', 'pwp' ) . '<br>';
		$section_desc .= __( 'By default, a copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline. The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache. Additionally, you can define other pre-cached resources using the "offline content" textarea.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineusage', __( 'Offline Usage', 'pwp' ), $section_desc );

		$choices = [];
		foreach ( get_pages() as $post ) {
			if ( get_option( 'page_on_front' ) == $post->ID ) {
				continue;
			}
			$choices[ $post->ID ] = get_the_title( $post );
		}
		pwp_settings()->add_select( $section, 'offline-page', __( 'Offline fallback Page', 'pwp' ), $choices, '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'This page should contain a message explaining why the requested content is not available.', 'pwp' ) . '</p>',
		] );

		$text = __( 'Pages and files that should be saved for offline usage on first interaction. One URL per line.', 'pwp' ) . '<br>';
		// translators: Every URL has to start with: [home_url]
		$text .= sprintf( __( 'Every URL has to start with: %1$s', 'pwp' ), '<code>' . untrailingslashit( get_home_url() ) . '</code>' );

		pwp_settings()->add_textarea( $section, 'offline-content', __( 'Offline Content', 'pwp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . $text . '</p>',
		] );

		pwp_settings()->add_checkbox( $section, 'offline-analytics', __( 'Offline Google Analytics', 'pwp' ), false, [
			'after_field' => '<p class="pwp-smaller">' . __( 'If the user is offline, analytics data can\'t be sent to google analytcs. This option will store the data and sync them as soon as the user is online again.', 'pwp' ) . '</p>',
		] );

		$section_desc = __( 'All network requests are cached by progressive WordPress. Here you are able to manually change the caching strategy for some request types.', 'pwp' ) . '<br>';
		$section_desc .= '<ul>';
		$section_desc .= '<li><b>' . __( 'Stale While Revalidate', 'pwp' ) . ':</b> ' . __( 'This strategy will use a cached response for a request if it is available and update the cache in the background with a response form the network. (If it’s not cached it will wait for the network response and use that). This is a fairly safe strategy as it means users are regularly updating their cache. The downside of this strategy is that it’s always requesting an asset from the network, using up the user’s bandwidth.', 'pwp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Network First', 'pwp' ) . ':</b> ' . __( 'This will try and get a request from the network first. If it receives a response, it’ll pass that to the browser and also save it to a cache. If the network request fails, the last cached response will be used.', 'pwp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Cache First', 'pwp' ) . ':</b> ' . __( 'This strategy will check the cache for a response first and use that if one is available. If the request isn’t in the cache, the network will be used and any valid response will be added to the cache before being passed to the browser.', 'pwp' ) . '</li>';
		$section_desc .= '</ul>';
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlinestrategies', __( 'Caching strategies', 'pwp' ), $section_desc );

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
			$home_url = untrailingslashit( get_home_url() );

			if ( strpos( $file, $home_url ) === 0 ) {
				$new_files[] = $file;
			}
		}

		return implode( "\n", $new_files );
	}

	public function sw_content( $content ) {

		$offline_enabled = pwp_get_setting( 'offline-enabled' );
		if ( ! $offline_enabled ) {
			return $content;
		}

		$offline_content = '';
		$cache_pages     = [];
		$home_url        = pwp_register_url( trailingslashit( get_home_url() ) );
		$cache_pages[]   = $home_url;

		$offline_page_id = intval( pwp_get_setting( 'offline-page' ) );
		if ( 'page' == get_post_type( $offline_page_id ) ) {
			$offline_url   = pwp_register_url( get_permalink( $offline_page_id ) );
			$cache_pages[] = $offline_url;
		}

		$additional_urls = pwp_get_setting( 'offline-content' );
		$additional_urls = explode( "\n", $additional_urls );
		if ( is_array( $additional_urls ) ) {
			foreach ( $additional_urls as $url ) {
				$cache_pages[] = pwp_register_url( $url );
			}
		}

		$cache_pages        = apply_filters( 'pwp_cache_pages', $cache_pages );
		$cache_pages_quoted = [];
		foreach ( $cache_pages as $url ) {
			$cache_pages_quoted[] = "'$url'";
		}

		$sw_data = [
			'offline'      => $offline_enabled,
			'offline_page' => str_replace( trailingslashit( get_home_url() ), '', get_permalink( $offline_page_id ) ),
			'cached_pages' => '[' . implode( ',', $cache_pages_quoted ) . ']',
		];

		$offline_file = plugin_dir_path( pwp_get_instance()->file ) . '/assets/serviceworker/offline.js';
		if ( file_exists( $offline_file ) && $offline_enabled ) {

			$offline_content .= file_get_contents( $offline_file );
		} else {
			return $content;
		}

		foreach ( $sw_data as $key => $val ) {
			$offline_content = str_replace( "{{{$key}}}", $val, $offline_content );
		}

		return $content . $offline_content;

	}

	public function offline_indicator_settings() {
		$section_desc = __( 'This adds a little notice which will be displayed if the device is offline.', 'pwp' ) . '<br>';
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineindicator', __( 'offline indicator  ', 'pwp' ), $section_desc );
		pwp_settings()->add_checkbox( $section, 'offline-indicator', __( 'Offline indicator', 'pwp' ), false );
		pwp_settings()->add_input( $section, 'offline-indicator-text', __( 'Message', 'pwp' ), $this->indicator_text );
		pwp_settings()->add_select( $section, 'offline-indicator-position', __( 'Position', 'pwp' ), [
			'bottom' => __( 'Bottom', 'pwp' ),
			'top'    => __( 'Top', 'pwp' ),
		], 'bottom' );

		pwp_settings()->add_color( $section, 'offline-indicator-color-text', __( 'Textcolor', 'pwp' ), '#ffffff' );
		pwp_settings()->add_color( $section, 'offline-indicator-color-background', __( 'Background-Color', 'pwp' ), '#000000' );
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

	/**
	 * Get ServiceWorker
	 */

	public function get_sw_content() {

		$plugin_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		$pre_cache  = json_encode( apply_filters( 'pwp_offline_precache', [] ) );

		$c = '';
		$c .= 'importScripts(\'' . $plugin_uri . 'assets/workbox-v3.4.1/workbox-sw.js\');';
		$c .= "\nif (workbox) {\n";
		$c .= "\nworkbox.setConfig({debug: true});\n";
		//$c .= "workbox.precaching.precache({$pre_cache});\n";
		foreach ( array_reverse( $this->routes, true ) as $key => $values ) {
			$strategy = pwp_get_setting( 'offline-strategy-' . $key );
			if ( 'default' == $key && 'page' == get_post_type( pwp_get_setting( 'offline-page' ) ) ) {
				$offline_url = get_permalink( pwp_get_setting( 'offline-page' ) );

				$c .= "const handler = (args) => workbox.strategies.{$strategy}({ cacheName: PwpSwVersion + '-{$key}'}).handle(args).then((response) => (!response) ? caches.match('{$offline_url}') : response);\n";
				$c .= "workbox.routing.registerRoute(new RegExp('{$values['regex']}'), handler);\n";
			} else {
				$c .= "workbox.routing.registerRoute( new RegExp('{$values['regex']}'), workbox.strategies.{$strategy}({ cacheName: PwpSwVersion + '-{$key}'}) );\n";
			}
		}

		if ( pwp_get_setting( 'offline-analytics' ) ) {
			$c .= "workbox.googleAnalytics.initialize();\n";
		}
		$c .= '}';

		$delete_file = plugin_dir_path( pwp_get_instance()->file ) . '/assets/serviceworker/delete-cache.js';
		if ( file_exists( $delete_file ) ) {
			$c .= file_get_contents( $delete_file );
		}

		$cache_version = hash( 'crc32', $c, false );

		return "( function() {\nconst PwpSwVersion = 'pwp-{$cache_version}';\n" . $c . "\n} )();";
	}
}
