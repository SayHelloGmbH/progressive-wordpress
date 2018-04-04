<?php

namespace nicomartin\ProgressiveWordPress;

class Offlineusage {

	public $capability = '';
	public $indicator_text = '';

	public function __construct() {
		$this->capability     = pwp_get_instance()->Init->capability;
		$this->indicator_text = 'you\'re currently offline';
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_filter( pwp_settings()->sanitize_filter . '_offline-content', [ $this, 'sanitize_offline_content' ] );
		add_filter( 'pwp_sw_content', [ $this, 'sw_content' ] );
		add_action( 'pwp_settings', [ $this, 'offline_indicator_settings' ] );
		add_action( 'wp_footer', [ $this, 'offline_indicator_template' ] );
	}

	public function settings() {

		$section_desc = __( 'This feature allows you to provide offline usage for your website.', 'pwp' ) . '<br>';
		$section_desc .= __( 'A copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline. The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineusage', __( 'Offline Usage', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'offline-enabled', __( 'Offline Usage enabled', 'pwp' ) );

		$choices = [];
		if ( 'page' != get_post_type( get_option( 'page_on_front' ) ) ) {
			$choices[0] = __( 'Front Page', 'options' );
		}
		foreach ( get_pages() as $post ) {
			$choices[ $post->ID ] = get_the_title( $post );
		}
		pwp_settings()->add_select( $section, 'offline-page', __( 'Offline Page', 'pwp' ), $choices, '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'This page should contain a message explaining why the requested content is not available.', 'pwp' ) . '</p>',
		] );

		$text = __( 'Pages and files that should be saved for offline usage on first interaction. One URL per line.', 'pwp' ) . '<br>';
		// translators: Every URL has to start with: [home_url]
		$text .= sprintf( __( 'Every URL has to start with: %1$s', 'pwp' ), '<code>' . untrailingslashit( get_home_url() ) . '</code>' );

		pwp_settings()->add_textarea( $section, 'offline-content', __( 'Offline Content', 'pwp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . $text . '</p>',
		] );
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
}
