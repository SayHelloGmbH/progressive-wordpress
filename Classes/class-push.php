<?php

namespace nicomartin\ProgressiveWordPress;

class Push {

	public $devices_option = 'pwp-push-devices';

	public function __construct() {

	}

	public function run() {
		if ( ! pwp_push_set() ) {
			return;
		}

		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_action( 'pwp_settings', [ $this, 'device_settings' ] );
		add_filter( 'pwp_footer_js', [ $this, 'footer_js' ] );

		/**
		 * Notifications Button
		 */

		add_action( 'wp_footer', [ $this, 'footer_template' ] );
		add_shortcode( 'pwp_notification_button', [ $this, 'shortcode_template' ] );

		/**
		 * Ajax
		 */

		add_action( 'wp_ajax_pwp_ajax_handle_device_id', [ $this, 'handle_device_id' ] );
		add_action( 'wp_ajax_nopriv_pwp_ajax_handle_device_id', [ $this, 'handle_device_id' ] );
	}

	public function settings() {
		$section_desc = __( 'This adds a fixed push notification button to the bottom of your page.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_button', __( 'Push Button', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'notification-button', __( 'Add notification button', 'pwp' ) );
		pwp_settings()->add_message( $section, 'notification-button-heading', '<h3>' . __( 'Button appearance', 'pwa' ) . '</h3>' );
		pwp_settings()->add_input( $section, 'notification-button-icon-color', __( 'Icon color', 'pwa' ), '#fff' );
		pwp_settings()->add_input( $section, 'notification-button-bkg-color', __( 'Background color', 'pwa' ), '#333' );
	}

	public function device_settings() {

		$devices = get_option( $this->devices_option );
		$table   = '';
		$table   .= '<table class="pwp-devicestable">';
		$table   .= '<thead><tr><th>' . __( 'Device', 'pwp' ) . '</th><th>' . __( 'Registered', 'pwp' ) . '</th><th></th></tr></thead>';
		$table   .= '<tbody>';
		if ( empty( $devices ) ) {
			$table .= '<tr><td colspan="3" class="empty">' . __( 'No devices registered', 'pwp' ) . '</td></tr>';
		} else {
			foreach ( $devices as $device ) {
				//$table .= '<pre>' . print_r( get_option( $this->devices_option ), true ) . '</pre>';
				$table .= '<tr>';
				$table .= '<td>';
				if ( isset( $device['data']['device']['vendor'] ) && isset( $device['data']['device']['device'] ) ) {
					$table .= "<span class='devices-item devices-item--device'>{$device['data']['device']['vendor']} {$device['data']['device']['device']}</span>";
				}
				if ( isset( $device['data']['browser']['browser'] ) && isset( $device['data']['browser']['major'] ) ) {
					$title = __( 'Browser', 'pwp' );
					$table .= "<span class='devices-item devices-item--browser'>$title: {$device['data']['browser']['browser']} {$device['data']['browser']['major']}</span>";
				}
				if ( isset( $device['data']['os']['os'] ) && isset( $device['data']['os']['version'] ) ) {
					//$title = __( 'Operating system', 'pwp' );
					$table .= "<span class='devices-item devices-item--os'>{$device['data']['os']['os']} {$device['data']['os']['version']}</span>";
				}
				$table .= '</td>';
				$table .= '<td>';
				$date  = date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $device['time'] );
				$table .= "<span class='devices-item devices-item--date'>{$date}</span>";
				if ( 0 != $device['wp_user'] ) {
					$display_name = get_userdata( $device['wp_user'] )->display_name;
					$table        .= "<span class='devices-item devices-item--user'>{$display_name}</span>";
				}
				$table .= '</td>';
				$table .= '<td>';
				$table .= '<span class="devices-actions devices-actions--send"><a class="button" onclick="alert(\'Sorry not yet ready\');">send push</a></span>';
				$table .= '<span class="devices-actions devices-actions--delete"><a id="pwpDeleteDevice" data-deviceid="' . $device['id'] . '" class="button button-pwpdelete">' . __( 'Remove device', 'pwp' ) . '</a></span>';
				$table .= '</td>';
				$table .= '</tr>';
			}
		}
		$table .= '</tbody>';
		$table .= '</table>';

		$section = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_devices', __( 'Devices', 'pwp' ), "<div class='pwp-devicestable__container'>$table</div>" );

		//pwp_settings()->add_message( $section, 'notification-button-heading', '', $table );
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

		$atts = [
			'class' => 'notification-button--fixedfooter',
			'style' => "background-color: $background_color; color: $icon_color; font-size: 35px",
		];

		echo pwp_get_notification_button( $atts );
	}

	public function shortcode_template( $atts, $content = '' ) {

		$atts = shortcode_atts( [
			'size'  => '1rem',
			'class' => '',
		], $atts );

		$attributes = [
			'class' => $atts['class'],
			'style' => "font-size: {$atts['size']};",
		];

		return pwp_get_notification_button( $attributes );
	}

	public function footer_js( $args ) {
		$args['message_pushremove_failed'] = __( 'Gerät konnte nicht entfernt werden.', 'pwp' );
		$args['message_pushadd_failed']    = __( 'Gerät konnte nicht registriert werden.', 'pwp' );

		return $args;
	}

	public function handle_device_id() {

		if ( ! isset( $_POST['user_id'] ) || '' == $_POST['user_id'] ) {
			pwp_exit_ajax( 'error', 'user ID error' );
		}

		if ( ! isset( $_POST['handle'] ) || ! in_array( $_POST['handle'], [ 'add', 'remove' ] ) ) {
			pwp_exit_ajax( 'error', 'handle error' );
		}

		$device_id  = $_POST['user_id'];
		$device_key = sanitize_title( $device_id );
		$handle     = $_POST['handle'];
		$devices    = get_option( $this->devices_option );
		if ( ! is_array( $devices ) ) {
			$devices = [];
		}

		$do_first_push = false;

		if ( 'add' == $handle ) {

			/**
			 * Check if is new device
			 */

			if ( ! array_key_exists( $device_key, $devices ) ) {
				$do_first_push = true;
			}

			/**
			 * Add Device
			 */

			$handled                = 'added';
			$devices[ $device_key ] = [
				'id'      => $device_id,
				'wp_user' => get_current_user_id(),
				'time'    => time(),
				'data'    => $_POST['clientData'],
				'groups'  => [],
			];

			$userdata = get_userdata( get_current_user_id() );

			if ( is_object( $userdata ) && is_array( $userdata->roles ) ) {
				$devices[ $device_key ]['groups'] = array_merge( $devices[ $device_key ]['groups'], $userdata->roles );
			}
		} elseif ( 'remove' == $handle ) {

			/**
			 * Remove Device
			 */

			$handled = 'removed';
			unset( $devices[ $device_key ] );
		} // End if().

		update_option( $this->devices_option, $devices );

		/*
		if ( $do_first_push ) {
			$data = [
				'title'    => 'hello!',
				'body'     => __( 'Sie werden von nun an auf diesem Weg ab und zu ausgewählte Neuigkeiten erhalten.', 'sht' ),
				'redirect' => '',
				'groups'   => [
					$device_id,
				],
			];
			$this->do_push( $data );
		}
		*/
		pwp_exit_ajax( 'success', "Device ID $device_id successfully $handled" );
	}

	/**
	 * Helpers
	 */

	private function is_hex( $value ) {
		return preg_match( '/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value );
	}
}
