<?php

namespace nicomartin\ProgressiveWordPress;

class Installable {

	public $capability = '';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_filter( 'pwp_manifest_values', [ $this, 'change_manifest_display' ] );
	}

	public function register_settings() {

		$section_desc = '<b>' . __( 'Make your website installable!', 'pwp' ) . '</b><br>';
		$section      = pwp_settings()->add_section( pwp_settings_page_manifest(), 'pwp_installable', __( 'Add to homescreen', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'installable-enabled', __( 'Enable add to homescreen', 'pwp' ) );
	}

	public function change_manifest_display( $values ) {
		if ( ! pwp_get_setting( 'installable-enabled' ) ) {
			$values['display'] = 'browser';
		}

		return $values;
	}
}
