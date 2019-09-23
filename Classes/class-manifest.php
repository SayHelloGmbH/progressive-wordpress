<?php

namespace nicomartin\ProgressiveWordPress;

class Manifest {

	public $capability = '';
	public $filter = 'web_app_manifest';

	public $rest_namespace = 'app/v1';
	public $rest_route = '/pwp-manifest';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_filter( $this->filter, [ $this, 'manifest_values' ] );
		add_filter( $this->filter, [ $this, 'httpsify_start_url' ] );

		/**
		 * Todo: theme-color meta not correct if PWA Plugin activated
		 */

		/**
		 * Register (if PWA Plugin not installed)
		 */

		add_action( 'rest_api_init', [ $this, 'register_manifest_rest_route' ] );
		add_action( 'wp_head', [ $this, 'manifest_link_and_meta' ] );
	}

	public function register_settings() {

		$section_desc = __( 'This values are used to create a manifest.json file, which then controls the appearance of you progressive web app.', 'progressive-wp' );
		$url          = 'https://developer.mozilla.org/de/docs/Web/Manifest';
		$section_desc .= '<br>' . __( 'Read all about the web app manifest:.', 'progressive-wp' ) . ' <a target="_blank" href="' . $url . '">' . $url . '</a>';
		$section      = pwp_settings()->add_section( pwp_settings_page_manifest(), 'pwp_manifest', __( 'Homescreen values', 'progressive-wp' ), $section_desc );

		pwp_settings()->add_input( $section, 'manifest-name', __( 'Name', 'progressive-wp' ) );
		pwp_settings()->add_input( $section, 'manifest-short-name', __( 'Short Name', 'progressive-wp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'max. 12 Chars', 'progressive-wp' ) . '</p>',
		] );

		pwp_settings()->add_select( $section, 'manifest-starturl', __( 'Start Page', 'progressive-wp' ), pwp_get_pages() );
		if ( pwp_supports_amp() ) {
			pwp_settings()->add_checkbox( $section, 'manifest-starturl-amp', __( 'AMP Start Page', 'progressive-wp' ), false, [
				'after_field' => '<p class="pwp-smaller">' . __( 'Use the AMP Version of the Start Page if available.', 'progressive-wp' ) . '</p>',
			] );
		}
		pwp_settings()->add_textarea( $section, 'manifest-description', __( 'Description', 'progressive-wp' ), '', [] );

		$query['autofocus[control]'] = 'site_icon';
		$url                         = add_query_arg( $query, admin_url( 'customize.php' ) );
		$customizer_title            = __( 'Customizer -> Site Icon', 'progressive-wp' );
		// translators: $s = url
		$content = '<p><small>' . sprintf( __( 'This Option has been removed. Please use the Site Icon from the customizer instead: %s.', 'awpp' ), "<br><a href='{$url}'>{$customizer_title} (Favicon)</a>" ) . '</small></p>';
		pwp_settings()->add_message( $section, 'manifest-icon-message', __( 'Icon', 'progressive-wp' ), $content );

		$choices = [
			'fullscreen' => __( 'Fullscreen - App takes whole display', 'progressive-wp' ),
			'standalone' => __( 'Standalone - Native App feeling', 'progressive-wp' ),
			'minimal-ui' => __( 'Minimal browser controls', 'progressive-wp' ),
		];
		$link    = 'https://developer.mozilla.org/de/docs/Web/Manifest#display';
		pwp_settings()->add_select( $section, 'manifest-display', __( 'Display mode', 'progressive-wp' ), $choices, 'standalone', [
			'after_field' => '<p class="pwp-smaller">' . __( 'possible display modes', 'progressive-wp' ) . ": <a href='$link' target='_blank'>$link</a></p>",
		] );

		pwp_settings()->add_select( $section, 'manifest-orientation', __( 'Orientation', 'progressive-wp' ), [
			'any'       => __( 'Both', 'progressive-wp' ),
			'landscape' => __( 'Landscape', 'progressive-wp' ),
			'portrait'  => __( 'Portrait', 'progressive-wp' ),
		], 'any' );

		pwp_settings()->add_color( $section, 'manifest-theme-color', __( 'Theme Color', 'progressive-wp' ), '#000000' );
		pwp_settings()->add_color( $section, 'manifest-background-color', __( 'Background Color', 'progressive-wp' ), '#ffffff' );
	}

	public function manifest_values( $manifest ) {

		$manifest['name']      = get_bloginfo( 'name' );
		$manifest['start_url'] = get_site_url();
		$manifest['display']   = 'minimal-ui';
		$manifest['dir']       = is_rtl() ? 'rtl' : 'ltr';

		$language = get_bloginfo( 'language' );
		if ( $language ) {
			$manifest['lang'] = $language;
		}

		if ( '' == pwp_get_setting( 'manifest-name' ) ) {
			return $manifest;
		}

		$manifest['name']             = pwp_get_setting( 'manifest-name' );
		$manifest['short_name']       = pwp_get_setting( 'manifest-short-name' );
		$manifest['start_url']        = pwp_get_setting( 'manifest-starturl' );
		$manifest['description']      = pwp_get_setting( 'manifest-description' );
		$manifest['theme_color']      = $this->sanitize_hex( pwp_get_setting( 'manifest-theme-color' ), '#000000' );
		$manifest['background_color'] = $this->sanitize_hex( pwp_get_setting( 'manifest-background-color' ), '#ffffff' );
		if ( 'none' == pwp_get_setting( 'installable-mode' ) ) {
			$manifest['display'] = 'browser';
		} else {
			$manifest['display'] = pwp_get_setting( 'manifest-display' );
		}
		$manifest['orientation'] = pwp_get_setting( 'manifest-orientation' );

		$sizes = [ 144, 192, 512, 524 ];

		$icon       = apply_filters( 'pwp_manifest_icon', get_option( 'site_icon' ) );
		$icon_width = wp_get_attachment_image_src( $icon, 'full' )[1];
		if ( wp_attachment_is_image( intval( $icon ) ) ) {
			foreach ( $sizes as $size ) {
				if ( $icon_width < $size ) {
					continue;
				}
				$new_image = pwp_get_instance()->image_resize( $icon, $size, $size, true, 'png' );
				if ( $new_image[1] != $size ) {
					continue;
				}
				$manifest['icons'][] = [
					'src'   => $new_image[0],
					'sizes' => "{$size}x{$size}",
					'type'  => 'image/png',
				];
			}
		}

		return $manifest;
	}

	public function httpsify_start_url( $manifest ) {
		if ( array_key_exists( 'start_url', $manifest ) ) {
			$manifest['start_url'] = str_replace( 'http://', 'https://', $manifest['start_url'] );
		}

		return $manifest;
	}

	public function register_manifest_rest_route() {
		if ( class_exists( 'WP_Web_App_Manifest' ) ) {
			return;
		}
		register_rest_route( $this->rest_namespace, $this->rest_route, [
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_manifest' ],
			'permission_callback' => [ $this, 'rest_permission' ],
		] );
	}

	public function get_manifest() {
		return apply_filters( 'web_app_manifest', [] );
	}

	public function rest_permission( $request ) {
		if ( 'edit' === $request['context'] ) {
			return new WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to edit the manifest.', 'progressive-wp' ), [
				'status' => rest_authorization_required_code(),
			] );
		}

		return true;
	}

	public function manifest_link_and_meta() {
		if ( class_exists( 'WP_Web_App_Manifest' ) ) {
			return;
		}
		echo '<link rel="manifest" href="' . esc_url( rest_url( $this->rest_namespace . $this->rest_route ) ) . '">';
		if ( pwp_get_setting( 'manifest-theme-color' ) ) {
			echo '<meta name="theme-color" content="' . pwp_get_setting( 'manifest-theme-color' ) . '">';
		}
	}

	/**
	 * Helpers
	 */

	public function sanitize_hex( $hex, $default = '#ffffff' ) {
		$hex = sanitize_hex_color( $hex );
		if ( '' == $hex ) {
			return $default;
		} else {
			return $hex;
		}
	}
}
