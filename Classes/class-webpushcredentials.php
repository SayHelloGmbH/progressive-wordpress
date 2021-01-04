<?php

namespace nicomartin\ProgressiveWordPress;

use Minishlink\WebPush\VAPID;

class WebPushCredentials {

	public static $vapid_option = 'pwp_vapid-credentials';
	public static $subject_key = 'vapid-subject';

	public function run() {
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_action( 'pwp_sanitize', [ $this, 'add_vapid' ] );
		add_action( 'admin_action_pwp_reset_vapid', [ $this, 'reset_vapid' ] );
	}

	public function settings() {

		$section_desc = '<p>' . __( 'The Web Push Protocol uses a Voluntary Application Server Identification (VAPID) for identification',
				'progressive-wp' ) . '</p>';
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_firebase',
			__( 'VAPID credentials', 'progressive-wp' ), $section_desc );

		$subject_setting = pwp_settings()->get_setting( self::$subject_key );
		$vapid_setting   = self::get_vapid();
		if ( $vapid_setting ) {
			pwp_settings()->add_message( $section, 'vapid-email-placeholder', __( 'VAPID Subject', 'progressive-wp' ),
				'<input type="text" name="vapid-email-placeholder" value="' . $vapid_setting['subject'] . '" disabled/>' );
			pwp_settings()->add_message( $section, 'vapid-public-key', __( 'VAPID Public Key', 'progressive-wp' ),
				'<input type="text" name="vapid-public-key-input" value="' . $vapid_setting['publicKey'] . '" disabled/>' );

			$private_key = $vapid_setting['privateKey'];
			if ( strlen( $private_key ) > 4 ) {
				$private_key = str_repeat( '*', strlen( $private_key ) - 10 ) . substr( $private_key, - 10 );
			}
			pwp_settings()->add_message( $section, 'vapid-private-key', __( 'VAPID Private Key', 'progressive-wp' ),
				'<input type="text" name="vapid-private-key-input" value="' . $private_key . '" disabled/>' );
		} else {
			pwp_settings()->add_input( $section, self::$subject_key, __( 'VAPID Subject', 'progressive-wp' ),
				get_option( 'admin_email' ) );
		}

		if ( $subject_setting && $vapid_setting ) {
			pwp_settings()->add_message( $section, 'remove-firebase-creds', '',
				'<p style="text-align: right;"><a href="admin.php?action=pwp_reset_vapid&site=' . get_current_blog_id() . '" onclick="return confirm(\'' . __( 'Are you sure you want to remove the VAPID settings? This will invalidate all current push-subscriptions.',
					'progressive-wp' ) . '\')" class="button button-pwpdelete" style="top: -24px; font-size: 12px; position:relative;">' . __( 'reset credentials',
					'progressive-wp' ) . '</a></p>' );
		}
	}

	public function add_vapid( $data ) {

		if ( ! self::get_vapid() ) {
			self::regenerate_vapid( $data[ self::$subject_key ] );
		}

		return $data;
	}

	public function reset_vapid() {
		if ( false === current_user_can( pwp_settings()->capability ) ) {
			wp_die( esc_html__( 'Access denied.', 'progressive-wp' ) );
		}

		update_option( self::$vapid_option, false );
		$sendback = wp_get_referer();
		wp_redirect( esc_url_raw( $sendback ) );
		exit;
	}

	public static function regenerate_vapid( $subject = '' ) {
		$vapid            = VAPID::createVapidKeys();
		$vapid['subject'] = $subject;
		update_option( self::$vapid_option, $vapid );
	}

	public static function get_vapid() {
		return get_option( self::$vapid_option, false );
	}
}
