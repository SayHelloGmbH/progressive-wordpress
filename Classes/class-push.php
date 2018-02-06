<?php

namespace nicomartin\ProgressiveWordPress;

class Push {

	public function __construct() {

	}

	public function run() {
		if ( ! pwp_push_set() ) {
			return;
		}

		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_action( 'wp_footer', [ $this, 'footer_template' ] );
		add_filter( 'pwp_footer_js', [ $this, 'footer_js' ] );
	}

	public function settings() {
		$section_desc = __( 'This adds a fixed push notification button to the bottom of your page.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_button', __( 'Push Button', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'notification-button', __( 'Add notification button', 'pwp' ) );
		pwp_settings()->add_message( $section, 'notification-button-heading', '<h3>' . __( 'Button appearance', 'pwa' ) . '</h3>' );
		pwp_settings()->add_input( $section, 'notification-button-icon-color', __( 'Icon color', 'pwa' ), '#fff' );
		pwp_settings()->add_input( $section, 'notification-button-bkg-color', __( 'Background color', 'pwa' ), '#333' );
	}

	public function footer_template() {
		$background_color = pwp_get_setting( 'notification-button-bkg-color' );
		$icon_color       = pwp_get_setting( 'notification-button-icon-color' );
		if ( ! $this->is_hex( $background_color ) ) {
			$background_color = '#333';
		}
		if ( ! $this->is_hex( $icon_color ) ) {
			$icon_color = '#fff';
		}

		$dir      = plugin_dir_path( pwp_get_instance()->file ) . 'assets/img/icon/';
		$icon_on  = $dir . 'bell-ring.svg';
		$icon_off = $dir . 'bell-off.svg';
		if ( ! is_file( $icon_on ) || ! is_file( $icon_off ) ) {
			return;
		}
		$icon_on  = file_get_contents( $icon_on );
		$icon_off = file_get_contents( $icon_off );

		echo "<button id='pwp-notification-button' class='notification-button' style='background-color: $background_color; color: $icon_color; font-size: 25px'>";
		echo "<span class='notification-button__icon notification-button__icon--on'>$icon_on</span>";
		echo "<span class='notification-button__icon notification-button__icon--off'>$icon_off</span>";
		echo '</button>';
	}

	public function footer_js( $args ) {
		$args['message_pushremove_failed'] = __( 'Gerät konnte nicht entfernt werden.', 'pwp' );
		$args['message_pushadd_failed']    = __( 'Gerät konnte nicht registriert werden.', 'pwp' );

		return $args;
	}

	/**
	 * Helpers
	 */

	private function is_hex( $value ) {
		return preg_match( '/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value );
	}
}
