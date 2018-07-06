<?php

namespace nicomartin\ProgressiveWordPress;

class Tracking {

	public $capability = '';
	public $utm_types = '';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
		$this->utm_types  = [
			'starturl' => [
				'title' => __( 'Start URL tracking', 'pwp' ),
				// translators: %s = tracking
				'desc'  => __( '%s will be added to the start URL', 'pwp' ),
			],
			'pushurl'  => [
				'title' => __( 'Push URL tracking', 'pwp' ),
				// translators: %s = tracking
				'desc'  => __( '%s will be added to the push notification redirect URL', 'pwp' ),
			],
		];
	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'register_settings' ] );
		add_filter( 'web_app_manifest', [ $this, 'tracking_to_starturl' ], 500 );
		add_filter( 'pwp_push_data_values', [ $this, 'tracking_to_pushurl' ], 500 );
	}

	public function register_settings() {

		$this->utm_parameters();

		foreach ( $this->utm_types as $key => $vals ) {

			$parameters = get_option( "pwp-tracking-$key-parameters" );
			if ( ! $parameters ) {
				$parameters = 'nothing';
			}

			$section_desc = sprintf( $vals['desc'], '<code>' . $parameters . '</code>' );
			$section      = pwp_settings()->add_section( pwp_settings_page_tracking(), "pwp-tracking-$key", $vals['title'], $section_desc );

			pwp_settings()->add_input( $section, "pwp-tracking-$key-source", __( 'Campaign Source', 'pwp' ), '', [
				'after_field' => '<p class="pwp-smaller">' . __( 'The referrer: (e.g. google, newsletter)', 'pwp' ) . '</p>',
			] );
			pwp_settings()->add_input( $section, "pwp-tracking-$key-medium", __( 'Campaign Medium', 'pwp' ), '', [
				'after_field' => '<p class="pwp-smaller">' . __( 'Marketing medium: (e.g. cpc, banner, email)', 'pwp' ) . '</p>',
			] );
			pwp_settings()->add_input( $section, "pwp-tracking-$key-campaign", __( 'Campaign Name', 'pwp' ), '', [
				'after_field' => '<p class="pwp-smaller">' . __( 'Product, promo code, or slogan (e.g. spring_sale)', 'pwp' ) . '</p>',
			] );
			pwp_settings()->add_input( $section, "pwp-tracking-$key-term", __( 'Campaign Term', 'pwp' ) );
			pwp_settings()->add_input( $section, "pwp-tracking-$key-content", __( 'Campaign Content', 'pwp' ), '', [
				'after_field' => '<p class="pwp-smaller">' . __( 'Use to differentiate ads', 'pwp' ) . '</p>',
			] );
		}
	}

	public function utm_parameters() {

		foreach ( $this->utm_types as $key => $vals ) {

			$parameters = [];
			foreach ( [ 'source', 'medium', 'term', 'content', 'campaign' ] as $p ) {
				$setting = pwp_get_setting( "pwp-tracking-$key-$p" );
				if ( $setting ) {
					$setting      = rawurlencode( $setting );
					$parameters[] = "utm_$p=$setting";
				}
			}
			if ( empty( $parameters ) ) {
				update_option( "pwp-tracking-$key-parameters", false );
			} else {
				update_option( "pwp-tracking-$key-parameters", implode( '&', $parameters ) );
			}
		}
	}

	public function tracking_to_starturl( $values ) {
		$parameters = get_option( 'pwp-tracking-starturl-parameters' );
		if ( $parameters ) {
			$values['start_url'] = $values['start_url'] . '?' . $parameters;
		}

		return $values;
	}

	public function tracking_to_pushurl( $values ) {
		$parameters = get_option( 'pwp-tracking-pushurl-parameters' );
		if ( $parameters && '' != $values['redirect'] ) {
			$values['redirect'] = $values['redirect'] . '?' . $parameters;
		}

		return $values;
	}
}
