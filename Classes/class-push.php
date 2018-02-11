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

		add_action( 'pwp_settings', [ $this, 'settings_button' ] );
		add_action( 'pwp_settings', [ $this, 'settings_devices' ] );
		add_action( 'pwp_settings', [ $this, 'settings_push' ] );
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

		add_action( 'wp_ajax_pwp_push_do_push', [ $this, 'do_modal_push' ] );
	}

	public function settings_button() {
		$section_desc = __( 'This adds a fixed push notification button to the bottom of your page.', 'pwp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_button', __( 'Push Button', 'pwp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'notification-button', __( 'Add notification button', 'pwp' ) );
		pwp_settings()->add_message( $section, 'notification-button-heading', '<h3>' . __( 'Button appearance', 'pwa' ) . '</h3>' );
		pwp_settings()->add_input( $section, 'notification-button-icon-color', __( 'Icon color', 'pwa' ), '#fff' );
		pwp_settings()->add_input( $section, 'notification-button-bkg-color', __( 'Background color', 'pwa' ), '#333' );
	}

	public function settings_devices() {

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
				//$table .= '<span class="devices-actions devices-actions--send"><a class="button" onclick="alert(\'Sorry not yet ready\');">send push</a></span>';
				$table .= $this->render_push_modal( '', '', '', 177, $device['id'] );
				$table .= '<span class="devices-actions devices-actions--delete"><a id="pwpDeleteDevice" data-deviceid="' . $device['id'] . '" class="button button-pwpdelete">' . __( 'Remove device', 'pwp' ) . '</a></span>';
				$table .= '</td>';
				$table .= '</tr>';
			}
		}
		$table .= '</tbody>';
		$table .= '</table>';

		$section = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_devices', __( 'Devices', 'pwp' ), "<div class='pwp-devicestable__container'>$table</div>" );
	}

	public function settings_push() {
		$section_desc = __( 'This adds a fixed push notification button to the bottom of your page.', 'pwp' );
		$section_desc = '';
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_push', __( 'Push default settings', 'pwp' ), $section_desc );

		pwp_settings()->add_file( $section, 'push-badge', __( 'Notification Bar Icon', 'pwp' ), 0, [
			'mimes'       => 'png',
			'min-width'   => 96,
			'min-height'  => 96,
			'after_field' => '<p class="pwp-smaller">' . __( 'This image will represent the notification when there is not enough space to display the notification itself such as, for example, the Android Notification Bar. It will be automatically masked. For the best result use a single-color graphic with transparent background.', 'pwp' ) . '</p>',
		] );
	}

	public function footer_js( $args ) {
		$args['message_pushremove_failed'] = __( 'Gerät konnte nicht entfernt werden.', 'pwp' );
		$args['message_pushadd_failed']    = __( 'Gerät konnte nicht registriert werden.', 'pwp' );

		return $args;
	}

	/**
	 * notification Button
	 */

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

	/**
	 * Ajax
	 */

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
				'body'     => __( 'Sie werden von nun an auf diesem Weg ab und zu ausgewählte Neuigkeiten erhalten.', 'pwp' ),
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

	public function do_modal_push() {
		if ( ! wp_verify_nonce( $_POST['pwp-push-nonce'], 'pwp-push-action' ) ) {
			sht_exit_ajax( 'success', 'Error' );
		}

		$image_id = $_POST['pwp-push-image'];
		if ( 'attachment' != get_post_type( $image_id ) ) {
			$image_id = ''; //todo: get default image
		}
		$image_url = pwp_get_instance()->image_resize( $image_id, 500, 500, true )[0];

		$data = [
			'title'     => sanitize_text_field( $_POST['pwp-push-title'] ),
			'body'      => sanitize_text_field( $_POST['pwp-push-body'] ),
			'redirect'  => esc_url_raw( $_POST['pwp-push-url'] ),
			'image_url' => esc_url_raw( $image_url ),
			'groups'    => [],
		];

		if ( '' != $_POST['pwp-push-limit'] ) {
			$post_groups = explode( ', ', $_POST['sht-push-limit'] );
			foreach ( $post_groups as $group ) {
				$data['groups'][] = $group;
			}
		}

		$return = $this->do_push( $data );

		sht_exit_ajax( $return['type'], $return['message'], $return );
	}

	/**
	 * Send push
	 */

	private function render_push_modal( $title = '', $body = '', $url = '', $image_id = 0, $limit = '' ) {

		if ( is_admin() ) {
			add_thickbox();
			wp_enqueue_media();
		}

		$image_thumbnail = '';
		if ( 'attachment' != get_post_type( $image_id ) ) {
			$image_id = 0;
		} else {
			$image_thumbnail = wp_get_attachment_image( $image_id );
		}

		if ( '' == $url ) {
			$url = trailingslashit( get_home_url() );
		}

		$fields = [
			'title' => [
				'name'  => __( 'Title', 'pwp' ),
				'value' => $title,
			],
			'body'  => [
				'name'  => __( 'Body', 'pwp' ),
				'value' => $body,
			],
			'url'   => [
				'name'  => __( 'URL', 'pwp' ),
				'value' => $url,
			],
			'image' => [
				'name'  => __( 'Image', 'pwp' ),
				'value' => $image_id,
			],
		];

		$r = '';
		$r .= '<a id="pwp-pushmodal-trigger" href="#TB_inline&inlineId=pwp-pushmodal-container&width=400&height=510" class="thickbox button">' . __( 'Create push notification', 'pwp' ) . '</a>';
		$r .= '<div id="pwp-pushmodal-container" style="display: none;">';
		$r .= '<div class="pwp-pushmodal">';
		$r .= '<h3>' . __( 'New Push-Notification', 'pwp' ) . '</h3>';
		if ( '' != $limit ) {
			$r .= '<b>' . __( 'This notification will be sent to the selected device.', 'pwp' ) . '</b><br><br>';
		}
		foreach ( $fields as $key => $args ) {
			$r .= "<label class='pwp-pushmodal__label pwp-pushmodal__label--$key'><b>{$args['name']}:</b>";
			if ( 'image' == $key ) {
				$r .= "<input type='hidden' name='pwp-push-{$key}' value='{$args['value']}' />";
				$r .= '<span class="pwpmodal-uploader">';
				$r .= '<span class="pwpmodal-uploader__image">' . $image_thumbnail . '</span><a id="uploadImage" class="button">' . __( 'upload image', 'pwp' ) . '</a><a id="removeImage" class="button button-pwpdelete">' . __( 'remove image', 'pwp' ) . '</a>';
				$r .= '</span>';
			} else {
				$r .= "<input type='text' name='pwp-push-{$key}' value='{$args['value']}' />";
			}
			$r .= '</label>';
		}
		$r .= "<input type='hidden' name='pwp-push-limit' value='$limit' />";
		$r .= '<input type="hidden" name="pwp-push-action" value="pwp_push_do_push" />';
		$r .= wp_nonce_field( 'pwp-push-action', 'pwp-push-nonce', true, false );
		$r .= '<div class="pwp-pushmodal__label pwp-pushmodal__controls"><a id="send" class="button button-primary">' . __( 'Send push', 'pwp' ) . '</a></div>';
		$r .= '<div class="loader"></div>';
		$r .= '</div>';
		$r .= '</div>';

		return $r;
	}

	private function do_push( $data ) {

		return [
			'type'    => 'error',
			'message' => 'Not yet ready',
		];

		/*

		$send_tos = $data['groups'];
		unset( $data['groups'] );

		$devices = [];
		foreach ( get_option( $this->devices_option ) as $device_data ) {
			$add_device = false;
			if ( empty( $send_tos ) ) {
				// send if no limitation set
				$add_device = true;
			} else {
				foreach ( $send_tos as $send_to ) {
					if ( in_array( $send_to, $device_data['groups'] ) ) {
						$add_device = true;
					} elseif ( $device_data['id'] == $send_to ) {
						$add_device = true;
					}
				}
			}
			if ( $add_device ) {
				$devices[] = $device_data['id'];
			}
		}

		if ( ! is_array( $devices ) || count( $devices ) == 0 ) {
			return [
				'type'    => 'error',
				'message' => 'No devices set',
			];
		}

		if ( strlen( $this->server_key ) < 8 ) {
			return [
				'type'    => 'error',
				'message' => 'Server API Key not set',
			];
		}

		$badge = get_field( hello_theme()->pfx . '-notification-bar-icon', 'option' );
		if ( array_key_exists( 'image_url', $data ) ) {
			$icon_url = $data['image_url'];
		} else {
			$image_id = get_field( hello_theme()->pfx . '-manifest-icon', 'option' );
			$icon_url = self::image_resize( $image_id, 500, 500, true )['url'];
		}

		$data = shortcode_atts( [
			'title'    => 'Say Hello GmbH', // Notification title
			'badge'    => ( $badge ? self::image_resize( $badge, 96, 96, true )['url'] : '' ), // small Icon for the notificaion bar (96x96 px, png)
			'body'     => '', // Notification message
			'icon'     => $icon_url, // small image
			'image'    => '', // bigger image
			'redirect' => '', // url
		], $data );

		$fields = [
			'registration_ids' => $devices,
			'data'             => [
				'message' => $data,
			],
		];

		file_put_contents( $this->latest_push_path, json_encode( $data ) );

		$headers = [
			'Authorization: key=' . $this->server_key,
			'Content-Type: application/json',
		];

		$ch = curl_init();

		curl_setopt( $ch, CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
		curl_setopt( $ch, CURLOPT_POST, true );
		curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ) );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, false );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
		$result = curl_exec( $ch );
		curl_close( $ch );

		$result = json_decode( $result, true );

		*/

		/**
		 * Check for failed push keys
		 */

		/*

		$success = [];
		$failed  = [];
		foreach ( $result['results'] as $key => $answer ) {
			if ( array_key_exists( 'error', $answer ) ) {
				$failed[] = $devices[ $key ];
			} else {
				$success[] = $devices[ $key ];
			}
		}

		*/

		/**
		 * remove failed push keys
		 */

		/*

		if ( ! empty( $failed ) ) {
			$old_devices = get_option( $this->devices_option );
			foreach ( $failed as $f ) {
				$f_key = sanitize_key( $f );
				unset( $old_devices[ $f_key ] );
			}
			update_option( $this->devices_option, $old_devices );
		}

		*/

		/**
		 * Save Push
		 */

		/*

		$latest_pushes = get_option( $this->latestpushes_option );
		if ( ! is_array( $latest_pushes ) ) {
			$latest_pushes = [];
		}
		$latest_pushes[ time() ] = array_merge( $data, [
			'failed'  => count( $failed ),
			'success' => count( $success ),
			'groups'  => $send_tos,
		] );
		update_option( $this->latestpushes_option, $latest_pushes );

		return [
			'type'    => 'success',
			'message' => '',
		];
		*/
	}

	/**
	 * Helpers
	 */

	private function is_hex( $value ) {
		return preg_match( '/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value );
	}
}
