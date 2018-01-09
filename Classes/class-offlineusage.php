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

		$section = pwp_settings()->add_section( pwp_settings_page_offlineusage(), 'pwp_offlineusage', __( 'Offline Usage', 'pwp' ) );

		pwp_settings()->add_checkbox( $section, 'offline-enabled', __( 'Offline Usage enabled', 'pwp' ) );

		$choices = [];
		foreach ( get_pages() as $post ) {
			$choices[ $post->ID ] = get_the_title( $post );
		}
		pwp_settings()->add_select( $section, 'offline-page', __( 'Offline Page', 'pwp' ), $choices );
	}
}
