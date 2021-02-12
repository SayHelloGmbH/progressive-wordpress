<?php

namespace nicomartin\ProgressiveWordPress;

use Minishlink\WebPush\WebPush as PHPWebPush;
use Minishlink\WebPush\Subscription;

class WebPush {

	public static $subscriptions_option = 'pwp-webpush-subscriptions';
	public $latestpushes_option = 'pwp-latest-webpushes';
	public $latest_push_path = '';
	public $latest_push_url = '';
	public $upload_dir = '';
	public $upload_url = '';

	public function __construct() {
		$this->upload_dir                = pwp_get_instance()->upload_dir . '/push-log/';
		$this->upload_url                = pwp_get_instance()->upload_url . '/push-log/';
		$GLOBALS['pwp_push_modal_count'] = 0;
	}

	public function run() {

		if ( ! is_dir( $this->upload_dir ) ) {
			mkdir( $this->upload_dir );
		}

		add_action( 'pwp_serviceworker', [ $this, 'get_sw_content' ] );

		add_action( 'pwp_settings', [ $this, 'settings_push' ] );
		add_action( 'pwp_settings', [ $this, 'settings_button' ] );
		add_action( 'pwp_settings', [ $this, 'settings_devices' ] );
		add_action( 'pwp_settings', [ $this, 'settingsFirstpush' ] );

		add_filter( 'pwp_footer_js', [ $this, 'footer_js' ] );

		/**
		 * Notifications Button
		 */

		add_action( 'wp_footer', [ $this, 'footer_template' ] );
		add_shortcode( 'pwp_notification_button', [ $this, 'shortcode_template' ] );

		/**
		 * Ajax
		 */

		add_action( 'wp_ajax_pwp_ajax_add_webpush_subscription', [ $this, 'add_subscription' ] );
		add_action( 'wp_ajax_nopriv_pwp_ajax_add_webpush_subscription', [ $this, 'add_subscription' ] );
		add_action( 'wp_ajax_pwp_ajax_remove_webpush_subscription', [ $this, 'remove_subscription' ] );
		add_action( 'wp_ajax_nopriv_pwp_ajax_remove_webpush_subscription', [ $this, 'remove_subscription' ] );

		add_action( 'wp_ajax_pwp_push_do_push', [ $this, 'do_modal_push' ] );

		/**
		 * Log
		 */

		add_action( 'wp_ajax_pwp_ajax_download_log-push-log', [ $this, 'download_log' ] );
	}

	public function get_sw_content() {
		if ( ! WebPushCredentials::get_vapid() ) {
			return;
		}

		$push_content = '';
		$push_file    = plugin_dir_path( pwp_get_instance()->file ) . '/assets/serviceworker/webpush.js';
		if ( file_exists( $push_file ) ) {
			$push_content .= file_get_contents( $push_file );
		}

		$path = plugin_dir_path( pwp_get_instance()->file ) . 'Classes/Libs';
		require_once $path . '/minify/autoload.php';
		require_once $path . '/path-converter/autoload.php';
		$minifier     = new \MatthiasMullie\Minify\JS( $push_content );
		$push_content = $minifier->minify();

		echo $push_content;
	}

	public function settings_push() {

		if ( ! WebPushCredentials::get_vapid() ) {
			return;
		}

		$section = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_push',
			__( 'Push Notification settings', 'progressive-wp' ) );

		pwp_settings()->add_checkbox( $section, 'push-failed-remove',
			__( 'Remove devices if failed once', 'progressive-wp' ), false );
		pwp_settings()->add_file( $section, 'push-badge', __( 'Notification Bar Icon', 'progressive-wp' ), 0, [
			'mimes'       => 'png',
			'min-width'   => 96,
			'min-height'  => 96,
			'after_field' => '<p class="pwp-smaller">' . __( 'This image will represent the notification when there is not enough space to display the notification itself such as, for example, the Android Notification Bar. It will be automatically masked. For the best result use a single-color graphic with transparent background.',
					'progressive-wp' ) . '<br>' . __( 'Has to be at least 92x92px', 'progressive-wp' ) . '</p>',
		] );
	}

	public function settings_button() {
		if ( ! WebPushCredentials::get_vapid() ) {
			return;
		}
		$section_desc = __( 'This adds a fixed push notification button to the bottom of your page.',
			'progressive-wp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_button',
			__( 'Push Button', 'progressive-wp' ), $section_desc );

		pwp_settings()->add_checkbox( $section, 'notification-button',
			__( 'Add notification button', 'progressive-wp' ) );
		pwp_settings()->add_message( $section, 'notification-button-heading',
			'<h3>' . __( 'Button appearance', 'pwa' ) . '</h3>' );
		pwp_settings()->add_color( $section, 'notification-button-icon-color', __( 'Icon color', 'pwa' ), '#ffffff' );
		pwp_settings()->add_color( $section, 'notification-button-bkg-color', __( 'Background color', 'pwa' ),
			'#333333' );
	}

	public function settings_devices() {
		if ( ! WebPushCredentials::get_vapid() ) {
			return;
		}

		$send = '<p style="margin-bottom: 30px;line-height: 250%"><b>' . __( 'Send to all devices',
				'progressive-wp' ) . ':</b><br>' . $this->render_push_modal() . '</p>';

		$subscriptions = self::get_subscriptions();
		$table         = '';
		//$table   .= '<pre>' . print_r( $devices, true ) . '</pre>';
		$table .= '<table class="pwp-devicestable">';
		$table .= '<thead><tr><th>' . __( 'Device', 'progressive-wp' ) . '</th><th>' . __( 'Registered',
				'progressive-wp' ) . '</th><th></th></tr></thead>';
		$table .= '<tbody>';
		if ( empty( $subscriptions ) ) {
			$table .= '<tr><td colspan="3" class="empty">' . __( 'No devices registered',
					'progressive-wp' ) . '</td></tr>';
		} else {
			foreach ( $subscriptions as $subscription ) {
				//$table .= '<pre>' . print_r( get_option( self::$subscriptions_option ), true ) . '</pre>';
				$table .= '<tr>';
				$table .= '<td>';
				foreach ( $subscription['clientdata'] as $row => $values ) {
					$infos   = [];
					$prepend = '';
					if ( 'browser' === $row ) {
						$prepend = __( 'Browser', 'progressive-wp' ) . ': ';
					}

					foreach ( $values as $vk => $info ) {
						if ( 'undefined' !== $info ) {
							$infos[] = $info;
						}
					}

					if ( ! empty( $infos ) ) {
						$infos = implode( ' ', $infos );
						$table .= "<span class='devices-item devices-item--{$row}'>{$prepend}{$infos}</span>";
					}
				}
				$table .= '</td>';
				$table .= '<td>';
				$date  = date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $subscription['time'] );
				$table .= "<span class='devices-item devices-item--date'>{$date}</span>";
				if ( 0 != $subscription['wp_user'] ) {
					$display_name = get_userdata( $subscription['wp_user'] )->display_name;
					$table        .= "<span class='devices-item devices-item--user'>{$display_name}</span>";
				}
				$table .= '</td>';
				$table .= '<td>';
				$table .= $this->render_push_modal( '', '', '', 0, $subscription['id'] );
				$table .= '<span class="devices-actions devices-actions--delete"><a id="pwpDeleteDevice" data-endpoint="' . $subscription['subscription']->endpoint . '" class="button button-pwpdelete">' . __( 'Remove device',
						'progressive-wp' ) . '</a></span>';
				$table .= '</td>';
				$table .= '</tr>';
			} // End foreach().
		} // End if().
		$table .= '</tbody>';
		$table .= '</table>';

		$section = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_devices',
			__( 'Devices', 'progressive-wp' ), $send . "<div class='pwp-devicestable__container'>$table</div>" );
	}

	public function settingsFirstpush() {
		if ( ! WebPushCredentials::get_vapid() ) {
			return;
		}
		$section_desc = __( 'Greet your subscribers with a custom push notification (Leave empty to disable)',
			'progressive-wp' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_push_first',
			__( 'First Push', 'progressive-wp' ), $section_desc );

		pwp_settings()->add_input( $section, 'notification-push-first-title', __( 'Title', 'progressive-wp' ),
			__( 'Hello!', 'progressive-wp' ) );
		pwp_settings()->add_input( $section, 'notification-push-first-body', __( 'Body', 'progressive-wp' ),
			__( 'From now on you will receive selected news on this way from time to time.', 'progressive-wp' ) );
	}

	public function footer_js( $args ) {
		$args['message_pushremove_failed'] = __( 'Device could not be removed.', 'progressive-wp' );
		$args['message_pushadd_failed']    = __( 'Device could not be registered.', 'progressive-wp' );

		return $args;
	}

	/**
	 * notification Button
	 */

	public function footer_template() {

		if ( ! pwp_get_setting( 'notification-button' ) ) {
			return;
		}

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

	public function add_subscription() {

		$data = json_decode( file_get_contents( 'php://input' ) );

		if ( ! isset( $data->subscription->endpoint ) || '' == $data->subscription->endpoint ) {
			pwp_exit_ajax( 'error', 'user ID error' );
		}

		$endpoint      = $data->subscription->endpoint;
		$id            = self::id_from_endpoint( $endpoint );
		$subscriptions = self::get_subscriptions();

		$do_first_push = ! array_key_exists( $id, $subscriptions );

		$subscriptions[ $id ] = [
			'id'           => $id,
			'wp_user'      => get_current_user_id(),
			'time'         => time(),
			'subscription' => $data->subscription,
			'clientdata'   => $data->clientdata,
			'groups'       => [],
		];

		$userdata = get_userdata( get_current_user_id() );

		if ( is_object( $userdata ) && is_array( $userdata->roles ) ) {
			$subscriptions[ $id ]['groups'] = array_merge( $subscriptions[ $id ]['groups'], $userdata->roles );
		}

		update_option( self::$subscriptions_option, $subscriptions );

		$first_push_title = pwp_get_setting( 'notification-push-first-title' );
		$first_push_body  = pwp_get_setting( 'notification-push-first-body' );

		if ( $do_first_push && $first_push_title && $first_push_body ) {
			$data = [
				'title'    => $first_push_title,
				'body'     => $first_push_body,
				'redirect' => '',
				'groups'   => [
					$id,
				],
			];
			$this->do_push( $data );
		}

		pwp_exit_ajax( 'success', "Device ID {$id} successfully added" );
	}

	public function remove_subscription() {
		$data     = json_decode( file_get_contents( 'php://input' ) );
		$endpoint = $data->endpoint;
		$id       = self::id_from_endpoint( $endpoint );

		$subscriptions = self::get_subscriptions();

		unset( $subscriptions[ $id ] );
		update_option( self::$subscriptions_option, $subscriptions );
		pwp_exit_ajax( 'success', "Device ID {$id} successfully removed" );
	}

	public function do_modal_push() {

		if ( ! wp_verify_nonce( $_POST['pwp-push-nonce'], 'pwp-push-action' ) ) {
			pwp_exit_ajax( 'success', 'Error' );
		}

		$image_id  = $_POST['pwp-push-image'];
		$image_url = '';
		if ( 'attachment' == get_post_type( $image_id ) ) {
			$image = pwp_get_instance()->image_resize( $image_id, 500, 500, true );
			if ( $image ) {
				$image_url = $image[0];
			}
		}

		$data = [
			'title'     => sanitize_text_field( $_POST['pwp-push-title'] ),
			'body'      => sanitize_text_field( $_POST['pwp-push-body'] ),
			'redirect'  => esc_url_raw( $_POST['pwp-push-url'] ),
			'image_url' => esc_url_raw( $image_url ),
			'groups'    => [],
		];

		if ( '' != $_POST['pwp-push-limit'] ) {
			$post_groups = explode( ', ', $_POST['pwp-push-limit'] );
			foreach ( $post_groups as $group ) {
				$data['groups'][] = $group;
			}
		}

		$return = $this->do_push( $data );

		pwp_exit_ajax( $return['type'], $return['message'], $return );
	}

	/**
	 * Log
	 */

	public function download_log() {

		$log = $this->latest_push_log();
		if ( $log ) {
			pwp_exit_ajax( 'success', '', [
				'url'  => $log,
				'file' => 'progressive-wp-latest-push-log.json',
			] );
		} else {
			pwp_exit_ajax( 'error', __( 'Logfile could not be created', 'progressive-wp' ) );
		}

		pwp_exit_ajax( 'error', __( 'Error', 'progressive-wp' ) );
	}

	/**
	 * Send push
	 */

	public function render_push_modal(
		$title = '',
		$body = '',
		$url = '',
		$image_id = 0,
		$limit = '',
		$pushpost = ''
	) {

		if ( is_admin() ) {
			add_thickbox();
		}

		$image_thumbnail = '';
		if ( 'attachment' != get_post_type( $image_id ) ) {
			$image_id = 0;
		} else {
			$image_thumbnail = wp_get_attachment_image( $image_id );
		}

		if ( '' == $url ) {
			$url = trailingslashit( get_site_url() );
		}

		$fields = [
			'title' => [
				'name'  => __( 'Title', 'progressive-wp' ),
				'value' => $title,
			],
			'body'  => [
				'name'  => __( 'Body', 'progressive-wp' ),
				'value' => $body,
			],
			'url'   => [
				'name'  => __( 'URL', 'progressive-wp' ),
				'value' => $url,
			],
			'image' => [
				'name'  => __( 'Image', 'progressive-wp' ),
				'value' => $image_id,
			],
		];

		$icon      = '';
		$icon_path = plugin_dir_path( pwp_get_instance()->file ) . 'assets/img/icon/check.svg';
		if ( file_exists( $icon_path ) ) {
			$icon = file_get_contents( $icon_path );
		}

		$GLOBALS['pwp_push_modal_count'] ++;

		$r = '';
		$r .= '<a id="pwp-pushmodal-trigger" href="#TB_inline&inlineId=pwp-pushmodal-container-' . $GLOBALS['pwp_push_modal_count'] . '&width=400&height=510&class=test" class="thickbox button">' . __( 'Create push notification',
				'progressive-wp' ) . '</a>';
		$r .= '<div id="pwp-pushmodal-container-' . $GLOBALS['pwp_push_modal_count'] . '" style="display: none;">';
		$r .= '<div class="pwp-pushmodal">';
		$r .= '<h3>' . __( 'New Push-Notification', 'progressive-wp' ) . '</h3>';
		if ( '' != $limit ) {
			$r .= '<b>' . __( 'This notification will be sent to the selected device.',
					'progressive-wp' ) . '</b><br><br>';
		}
		foreach ( $fields as $key => $args ) {
			$r .= "<label class='pwp-pushmodal__label pwp-pushmodal__label--$key'><b>{$args['name']}:</b>";
			if ( 'image' == $key ) {
				$r .= "<input type='hidden' name='pwp-push-{$key}' value='{$args['value']}' />";
				$r .= '<span class="pwpmodal-uploader">';
				$r .= '<span class="pwpmodal-uploader__image">' . $image_thumbnail . '</span><a id="uploadImage" class="button">' . __( 'upload image',
						'progressive-wp' ) . '</a><a id="removeImage" class="button button-pwpdelete">' . __( 'remove image',
						'progressive-wp' ) . '</a>';
				$r .= '</span>';
			} else {
				$r .= "<input type='text' name='pwp-push-{$key}' value='{$args['value']}' />";
			}
			$r .= '</label>';
		}
		$r .= "<input type='hidden' name='pwp-push-limit' value='$limit' />";
		$r .= '<input type="hidden" name="pwp-push-action" value="pwp_push_do_push" />';
		$r .= '<input type="hidden" name="pwp-push-pushpost" value="' . $pushpost . '" />';
		$r .= wp_nonce_field( 'pwp-push-action', 'pwp-push-nonce', true, false );
		$r .= '<div class="pwp-pushmodal__label pwp-pushmodal__controls"><a id="send" class="button button-primary">' . __( 'Send push',
				'progressive-wp' ) . '</a></div>';
		$r .= '<div class="loader"></div>';
		$r .= '<div class="success"><div class="success__content">' . $icon . __( 'Notifications have been sent',
				'progressive-wp' ) . '</div></div>';
		$r .= '</div>';
		$r .= '</div>';

		return $r;
	}

	private function do_push( $data ) {

		$log = [];

		$send_tos = $data['groups'];
		unset( $data['groups'] );

		$send_to_subscriptions = [];
		$subscriptions         = self::get_subscriptions();
		foreach ( $subscriptions as $subscription_data ) {
			$add_device = false;
			if ( empty( $send_tos ) ) {
				// send if no limitation set
				$add_device = true;
			} else {
				foreach ( $send_tos as $send_to ) {
					if ( $subscription_data['id'] == $send_to ) {
						$add_device = true;
					}
				}
			}
			if ( $add_device ) {
				$send_to_subscriptions[] = $subscription_data['subscription'];
				$log['devices'][]        = $subscription_data;
			}
		}

		if ( ! is_array( $send_to_subscriptions ) || count( $send_to_subscriptions ) == 0 ) {
			return [
				'type'    => 'error',
				'message' => __( 'No devices set', 'progressive-wp' ),
			];
		}

		/**
		 * Badge
		 */

		$badge     = pwp_get_setting( 'push-badge' );
		$badge_url = '';
		if ( 'attachment' == get_post_type( $badge ) ) {
			$badge_image = pwp_get_instance()->image_resize( $badge, 96, 96, true );
			if ( $badge_image ) {
				$badge_url = $badge_image[0];
			}
		} else {
			$badge_url = '';
		}

		/**
		 * Icon
		 */

		$data['icon'] = $data['image_url'];

		/**
		 * Full data
		 */

		$data = shortcode_atts( [
			'title'    => 'Say Hello GmbH', // Notification title
			'badge'    => $badge_url, // small Icon for the notificaion bar (96x96 px, png)
			'body'     => '', // Notification message
			'icon'     => '', // small image
			'image'    => '', // bigger image
			'redirect' => '', // url
		], $data );

		$data = apply_filters( 'pwp_push_data_values', $data );

		$data['title'] = addslashes( $data['title'] );
		$data['body']  = addslashes( $data['body'] );

		$log['message'] = $data;

		$vapid_details = WebPushCredentials::get_vapid();

		$web_push = new PHPWebPush( [
			'VAPID' => [
				'subject'    => $vapid_details['subject'],
				'publicKey'  => $vapid_details['publicKey'],
				'privateKey' => $vapid_details['privateKey'],
			]
		] );

		foreach ( $send_to_subscriptions as $subscription ) {
			$web_push->queueNotification(
				Subscription::create( [
					'endpoint' => $subscription->endpoint,
					'keys'     => [
						'p256dh' => $subscription->keys->p256dh,
						'auth'   => $subscription->keys->auth
					],
				] ),
				json_encode( $data )
			);
		}

		foreach ( $web_push->flush() as $report ) {
			$endpoint = $report->getRequest()->getUri()->__toString();

			if ( $report->isSuccess() ) {
				$success[] = [
					'id' => self::id_from_endpoint( $endpoint ),
				];
			} else {
				$failed[] = [
					'id'     => self::id_from_endpoint( $endpoint ),
					'reason' => $report->getReason(),
				];
			}
		}

		$file = 'push_log_' . time() . '.json';
		pwp_put_contents( $this->upload_dir . $file, json_encode( [
			'success' => $success,
			'failed'  => $failed,
			'log'     => $log,
		] ) );

		return [
			'type'    => 'success',
			'message' => '',
			'success' => $success,
			'failed'  => $failed,
		];
	}

	/**
	 * Helpers
	 */

	private function is_hex( $value ) {
		return preg_match( '/#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/', $value );
	}

	public function latest_push_log() {

		if ( ! pwp_push_set() ) {
			return false;
		}

		$files = scandir( $this->upload_dir, SCANDIR_SORT_DESCENDING );
		if ( ! $files || empty( $files ) ) {
			return false;
		}

		$newest_file = $files[0];
		if ( '..' == $newest_file || '.' == $newest_file ) {
			return false;
		}

		return $this->upload_url . $newest_file;
	}

	private function get_subscriptions() {
		$subscriptions = get_option( self::$subscriptions_option );
		if ( ! is_array( $subscriptions ) ) {
			$subscriptions = [];
		}

		return $subscriptions;
	}

	private function id_from_endpoint( $endpoint ) {
		return sanitize_title( $endpoint );
	}
}
