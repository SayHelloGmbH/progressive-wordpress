<?php

namespace nicomartin\ProgressiveWordPress;

class Manifest {

	public $capability = '';
	public $manifest_path = ABSPATH . 'pwp-manifest.json';
	public $manifest_url = '/pwp-manifest.json';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_action( 'pwp_after_save', [ $this, 'save_manifest' ] );
		add_action( 'pwp_on_update', [ $this, 'save_manifest' ] );

		add_filter( 'pwp_sanitize_manifest-starturl', [ $this, 'starturl_sanitize' ] );

		add_action( 'pwp_on_deactivate', [ $this, 'delete_manifest' ] );

		if ( file_exists( $this->manifest_path ) ) {
			add_action( 'wp_head', [ $this, 'add_to_header' ], 1 );
		}
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

		pwp_settings()->add_input( $section, 'manifest-starturl', __( 'Start URL', 'pwp' ), './' );

		pwp_settings()->add_textarea( $section, 'manifest-description', __( 'Description', 'pwp' ), '', [] );
		pwp_settings()->add_file( $section, 'manifest-icon', __( 'Icon', 'pwp' ), 0, [
			'mimes'      => 'png',
			'min-width'  => 144,
			'min-height' => 144,
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

		$args = [
			'after_field' => '<p class="pwp-smaller">' . __( 'hex value', 'pwp' ) . '</p>',
		];
		pwp_settings()->add_input( $section, 'manifest-theme-color', __( 'Theme Color', 'pwp' ), '', $args );
		pwp_settings()->add_input( $section, 'manifest-background-color', __( 'Background Color', 'pwp' ), '', $args );
	}

	public function save_manifest() {

		if ( '' == pwp_get_setting( 'manifest-name' ) ) {
			return;
		}

		$manifest                     = [];
		$manifest['name']             = pwp_get_setting( 'manifest-name' );
		$manifest['short_name']       = str_replace( ' ', '', pwp_get_setting( 'manifest-short-name' ) );
		$manifest['start_url']        = './';
		$manifest['description']      = pwp_get_setting( 'manifest-description' );
		$manifest['theme_color']      = sanitize_hex_color( pwp_get_setting( 'manifest-theme-color' ) );
		$manifest['background_color'] = sanitize_hex_color( pwp_get_setting( 'manifest-background-color' ) );
		$manifest['display']          = pwp_get_setting( 'manifest-display' );
		$manifest['lang']             = '';
		$manifest['orientation']      = 'any';

		$sizes = [ 128, 512 ];
		$icon  = pwp_get_setting( 'manifest-icon' );
		if ( wp_attachment_is_image( intval( $icon ) ) ) {
			$mime = get_post_mime_type( $icon );
			foreach ( $sizes as $size ) {
				$manifest['icons'][] = [
					'src'   => pwp_register_url( pwp_get_instance()->image_resize( $icon, $size, $size, true )['url'] ),
					'type'  => $mime,
					'sizes' => "{$size}x{$size}",
				];
			}
		}

		$manifest = apply_filters( 'pwp_manifest_values', $manifest );
		$content  = json_encode( $manifest, JSON_UNESCAPED_SLASHES );
		$save     = file_put_contents( $this->manifest_path, $content );
		if ( ! $save ) {
			add_action( 'admin_notices', function () {
				echo '<div class="notice notice-error">';
				// translators: There was a problem generating your manifest file. Please check your permissions for ABSPATH
				echo '<p>' . sprintf( __( 'There was a problem generating your manifest file. Please check your permissions for %s', 'pwp' ), '<code>' . ABSPATH . '</code>' ) . '</p>';
				echo '</div>';
			} );
		}
	}

	public function starturl_sanitize( $value ) {
		$value = preg_replace( '~[^\\pL0-9_\/.]+~u', '-', $value );
		$value = trim( $value, '-' );
		$value = iconv( 'utf-8', 'us-ascii//TRANSLIT', $value );
		$value = strtolower( $value );
		$value = preg_replace( '~[^-a-z0-9_\/.]+~', '', $value );

		return $value;
	}

	public function add_to_header() {
		if ( ! is_file( $this->manifest_path ) ) {
			return;
		}

		$url = untrailingslashit( get_home_url() ) . $this->manifest_url;
		echo '<link rel="manifest" href="' . pwp_register_url( $url ) . '">';
	}

	public function delete_manifest() {
		if ( file_exists( ABSPATH . 'manifest.json' ) ) {
			unlink( ABSPATH . 'manifest.json' );
		}
		if ( file_exists( $this->manifest_path ) ) {
			unlink( $this->manifest_path );
		}
	}
}
