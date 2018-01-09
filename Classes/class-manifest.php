<?php

namespace nicomartin\ProgressiveWordPress;

class Manifest {

	public $capability = '';
	public $manifest_path = ABSPATH . 'manifest.json';
	public $manifest_url = '/manifest.json';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_action( 'pwp_on_sanitize', [ $this, 'save_manifest' ] );
		if ( file_exists( $this->manifest_path ) ) {
			add_action( 'wp_head', [ $this, 'add_to_header' ], 1 );
		}
	}

	public function register_settings() {

		$section = pwp_settings()->add_section( pwp_settings_page_manifest(), 'pwp_manifest', __( 'Manifest.json values', 'pwp' ) );

		pwp_settings()->add_input( $section, 'manifest-name', __( 'Name', 'pwp' ) );
		pwp_settings()->add_input( $section, 'manifest-short-name', __( 'Short Name', 'pwp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'max. 12 Chars', 'pwp' ) . '</p>',
		] );

		pwp_settings()->add_textarea( $section, 'manifest-description', __( 'Description', 'pwp' ), '', [] );
		pwp_settings()->add_file( $section, 'manifest-icon', __( 'Icon', 'pwp' ) );

		$choices = [
			'fullscreen' => 'Fullscreen',
			'standalone' => 'Standalone',
			'minimal-ui' => 'Minimal',
			'browser'    => 'Browser',
		];
		$link    = 'https://developer.mozilla.org/de/docs/Web/Manifest#display';
		pwp_settings()->add_select( $section, 'manifest-display', __( 'Display mode', 'pwp' ), $choices, 'browser', [
			'after_field' => '<p class="pwp-smaller">' . __( 'possible display modes', 'pwp' ) . ": <a href='$link' target='_blank'>$link</a></p>",
		] );

		$args = [
			'after_field' => '<p class="pwp-smaller">' . __( 'hex value', 'pwp' ) . '</p>',
		];
		pwp_settings()->add_input( $section, 'manifest-theme-color', __( 'Theme Color', 'pwp' ), '', $args );
		pwp_settings()->add_input( $section, 'manifest-background-color', __( 'Background Color', 'pwp' ), '', $args );
	}

	public function save_manifest( $data ) {
		if ( ! array_key_exists( 'manifest-name', $data ) ) {
			return;
		}

		$manifest                     = [];
		$manifest['name']             = $data['manifest-name'];
		$manifest['short_name']       = str_replace( ' ', '', $data['manifest-short-name'] );
		$manifest['start_url']        = './';
		$manifest['description']      = $data['manifest-description'];
		$manifest['theme_color']      = sanitize_hex_color( $data['manifest-theme-color'] );
		$manifest['background_color'] = sanitize_hex_color( $data['manifest-background-color'] );
		$manifest['display']          = $data['manifest-display'];
		$manifest['lang']             = '';
		$manifest['orientation']      = 'any';

		$sizes = [ 128, 512 ];
		if ( array_key_exists( 'manifest-icon', $data ) && wp_attachment_is_image( intval( $data['manifest-icon'] ) ) ) {
			$mime = get_post_mime_type( $data['manifest-icon'] );
			foreach ( $sizes as $size ) {
				$manifest['icons'][] = [
					'src'   => str_replace( get_home_url(), '', pwp_get_instance()->image_resize( $data['manifest-icon'], $size, $size, true )['url'] ),
					'type'  => $mime,
					'sizes' => "{$size}x{$size}",
				];
			}
		}

		$content = json_encode( $manifest, JSON_UNESCAPED_SLASHES );
		file_put_contents( $this->manifest_path, $content );
		pwp_get_instance()->Serviceworker->regenerate();
	}

	public function add_to_header() {
		echo '<link rel="manifest" href="' . $this->manifest_url . '">';
	}
}
