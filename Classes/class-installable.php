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
		add_filter( 'pwp_footer_js', [ $this, 'footer_js_installvars' ] );
	}

	public function register_settings() {

		$section_desc = '<b>' . __( 'Make your website installable!', 'pwp' ) . '</b><br>';
		$section_desc .= __( 'With this feature you are able to display an "add to homescreen" prompt. This way your website gets a prominent place on the users home screen right next to the native apps.', 'pwp' ) . '<br><br>';
		//$section_desc .= __( 'Please make sure your site matches the "add to homescreen" criteria.', 'pwp' ) . ': <a href="https://developers.google.com/web/fundamentals/app-install-banners/" target="_blank">https://developers.google.com/web/fundamentals/app-install-banners/</a><br>';
		$section_desc .= '<ul>';
		$section_desc .= '<li><b>' . __( 'Normal', 'pwp' ) . '</b>: ' . __( 'The browser will show a mini-infobar which opens the install promt', 'pwp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'On element click', 'pwp' ) . '</b>: ' . __( 'Define an element as an install-prompt trigger', 'pwp' ) . '</li>';
		$section_desc .= '<li><b>' . __( 'Never', 'pwp' ) . '</b>: ' . __( 'This will override the display mode to `browser`, so the browser will not try to add an install-prompt', 'pwp' ) . '</li>';
		$section_desc .= '</ul>';
		$section      = pwp_settings()->add_section( pwp_settings_page_manifest(), 'pwp_installable', __( 'Add to homescreen', 'pwp' ), $section_desc );

		//pwp_settings()->add_checkbox( $section, 'installable-enabled', __( 'Enable add to homescreen', 'pwp' ) );
		pwp_settings()->add_select( $section, 'installable-mode', __( 'Show "add to homescreen" banner', 'pwp' ), [
			//'pageload' => __( 'after X pageloads', 'pwp' ),
			'normal'  => __( 'Normal', 'pwp' ),
			'trigger' => __( 'On element click', 'pwp' ),
			'none'    => __( 'Never', 'pwp' ),
		], 'pageload' );

		pwp_settings()->add_input( $section, 'installable-pageloads', __( 'Number of pageloads', 'pwp' ), '2' );
		pwp_settings()->add_input( $section, 'installable-onclick', __( 'Element', 'pwp' ), '', [
			'after_field' => '<p class="pwp-smaller">' . __( 'should be a jQuery selector (.my-click-element)', 'pwp' ) . '</p><p class="pwp-smaller">' . __( 'As soon as your web app can be installed, a class `installable-active` will be added to this element and the prompt will be shown on click.', 'pwp' ) . '</p>',
		] );
	}

	public function change_manifest_display( $values ) {
		if ( ! pwp_get_setting( 'installable-enabled' ) ) {
			$values['display'] = 'browser';
		}

		return $values;
	}

	public function footer_js_installvars( $atts ) {
		$mode      = pwp_settings()->get_setting( 'installable-mode' );
		$pageloads = pwp_settings()->get_setting( 'installable-pageloads' );
		$onclick   = pwp_settings()->get_setting( 'installable-onclick' );

		$atts['installprompt'] = [
			'mode'      => $mode,
			'pageloads' => $pageloads,
			'onclick'   => addslashes( $onclick ),
		];

		return $atts;
	}
}
