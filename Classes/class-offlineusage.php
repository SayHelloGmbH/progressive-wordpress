<?php

namespace nicomartin\ProgressiveWordPress;

class Offlineusage {

	public $capability = '';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
	}

	public function register_settings() {

		$section_desc = __( 'This feature allows you to provide offline usage for your website.', 'pwp' ) . '<br>';
		$section_desc .= __( 'A copy of each pages is stored in the cache as your visitors view them. This allows a visitor to load any previously viewed page while they are offline. This then adds the "offline page" that allows you to customize the message and experience if the app is offline, and the page is not in the cache.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineusage', __( 'Offline Usage', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'offline-enabled', __( 'Offline Usage enabled', 'pwp' ) );

		$choices = [];
		foreach ( get_pages() as $post ) {
			$choices[ $post->ID ] = get_the_title( $post );
		}
		pwp_settings()->add_select( $section, 'offline-page', __( 'Offline Page', 'pwp' ), $choices );
	}
}
