<?php

namespace nicomartin\ProgressiveWordPress;

class Manifest {

	public $capability = '';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_filter( 'web_app_manifest', [ $this, 'manifest' ] );
	}

	public function register_settings() {

		//$section_desc = '<b>' . __( 'Make your website installable!', 'pwp' ) . '</b><br>';
		$section_desc = __( 'This values are used to create a manifest.json file, which provides the data to make your website installable.', 'pwp' );
		$url          = 'https://developer.mozilla.org/de/docs/Web/Manifest';
		$section_desc .= '<br>' . __( 'Read all about the web app manifest:.', 'pwp' ) . ' <a target="_blank" href="' . $url . '">' . $url . '</a>';
		$section      = pwp_settings()->add_section( pwp_settings_page_manifest(), 'pwp_manifest', __( 'Manifest.json values', 'pwp' ), $section_desc );

		pwp_settings()->add_input( $section, 'manifest-name', __( 'Name', 'pwp' ) );
		pwp_settings()->add_input( $section, 'manifest-short-name', __( 'Short Name', 'pwp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'max. 12 Chars', 'pwp' ) . '</p>',
		] );

		pwp_settings()->add_input( $section, 'manifest-starturl', __( 'Start URL', 'pwp' ), '/' );

		pwp_settings()->add_textarea( $section, 'manifest-description', __( 'Description', 'pwp' ), '', [] );
		pwp_settings()->add_file( $section, 'manifest-icon', __( 'Icon', 'pwp' ), 0, [
			'mimes'       => 'png',
			'min-width'   => 128,
			'min-height'  => 128,
			'after_field' => '<p class="pwp-smaller">' . __( 'has to be at least 128x128px', 'pwp' ) . '</p>',
		] );

		$choices = [
			'fullscreen' => 'Fullscreen',
			'standalone' => 'Standalone',
			'minimal-ui' => 'Minimal',
		];
		$link    = 'https://developer.mozilla.org/de/docs/Web/Manifest#display';
		pwp_settings()->add_select( $section, 'manifest-display', __( 'Display mode', 'pwp' ), $choices, 'standalone', [
			'after_field' => '<p class="pwp-smaller">' . __( 'possible display modes', 'pwp' ) . ": <a href='$link' target='_blank'>$link</a></p>",
		] );

		pwp_settings()->add_select( $section, 'manifest-orientation', __( 'Orientation', 'pwp' ), [
			'any'       => __( 'Both', 'pwp' ),
			'landscape' => __( 'Landscape', 'pwp' ),
			'portrait'  => __( 'Portrait', 'pwp' ),
		], 'any' );

		$args = [
			'after_field' => '<p class="pwp-smaller">' . __( 'hex value', 'pwp' ) . '</p>',
		];
		pwp_settings()->add_color( $section, 'manifest-theme-color', __( 'Theme Color', 'pwp' ), '#000000', $args );
		pwp_settings()->add_color( $section, 'manifest-background-color', __( 'Background Color', 'pwp' ), '#ffffff', $args );
	}

	public function manifest( $manifest ) {

		if ( '' == pwp_get_setting( 'manifest-name' ) ) {
			return $manifest;
		}

		$manifest['name']             = pwp_get_setting( 'manifest-name' );
		$manifest['short_name']       = str_replace( ' ', '', pwp_get_setting( 'manifest-short-name' ) );
		$manifest['start_url']        = './';
		$manifest['description']      = pwp_get_setting( 'manifest-description' );
		$manifest['theme_color']      = $this->sanitize_hex( pwp_get_setting( 'manifest-theme-color' ), '#000000' );
		$manifest['background_color'] = $this->sanitize_hex( pwp_get_setting( 'manifest-background-color' ), '#ffffff' );
		$manifest['display']          = pwp_get_setting( 'manifest-display' );
		$manifest['lang']             = get_locale();
		$manifest['orientation']      = pwp_get_setting( 'manifest-orientation' );

		$sizes = [ 128, 192, 512, 524 ];
		$icon  = pwp_get_setting( 'manifest-icon' );
		if ( wp_attachment_is_image( intval( $icon ) ) ) {
			$mime = get_post_mime_type( $icon );
			foreach ( $sizes as $size ) {
				$new_image = pwp_get_instance()->image_resize( $icon, $size, $size, true );
				if ( $new_image[1] != $size ) {
					continue;
				}
				$manifest['icons'][] = [
					'src'   => pwp_register_url( $new_image[0] ),
					'type'  => $mime,
					'sizes' => "{$size}x{$size}",
				];
			}
		}

		return $manifest;
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
