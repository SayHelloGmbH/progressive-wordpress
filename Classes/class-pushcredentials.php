<?php

namespace nicomartin\ProgressiveWordPress;

class PushCredentials {

	public $cred_option = 'pwp_firebase_credentials_set';

	public function __construct() {

	}

	public function run() {
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_action( 'pwp_sanitize', [ $this, 'check_firebase_creds' ] );
		add_action( 'admin_action_pwp_remove_firebase_creds', [ $this, 'remove_firebase_creds' ] );
		add_action( 'admin_notices', [ $this, 'creds_error' ] );
		add_filter( 'pwp_manifest_values', [ $this, 'add_sender_id_to_manifest' ] );
	}

	public function settings() {

		$fields = [
			'firebase-serverkey' => __( 'Server Key', 'pwp' ),
			'firebase-senderid'  => __( 'Sender ID', 'pwp' ),
		];

		$cred_set = false;
		if ( pwp_push_set() ) {
			$cred_set = true;
		}
		$section_desc = '';
		if ( ! $cred_set ) {
			$section_desc = __( 'This plugin uses Firebase Cloud Messaging as a messaging service.', 'pwp' );
			$section_desc .= '<ul>';
			// translators: Go to url
			$section_desc .= '<li>' . sprintf( __( 'Go to %s', 'pwp' ), '<a href="https://console.firebase.google.com" target="_blank">Firebase Console</a>' ) . '</li>';
			$section_desc .= '<li>' . __( 'Click "create new project"', 'pwp' ) . '</li>';
			$section_desc .= '<li>' . __( 'Follow the instructions to create your project', 'pwp' ) . '</li>';
			$section_desc .= '<li>' . __( 'Now navigate to Project setting page', 'pwp' ) . '</li>';
			$section_desc .= '<li>' . __( 'Navigate to Cloud Messaging Tab', 'pwp' ) . '</li>';
			$section_desc .= '<li>' . __( 'There you will get two important key’s "Server Key" and "Sender Id"', 'pwp' ) . '</li>';
			$section_desc .= '</ul>';
		}

		$section = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_firebase', __( 'Firebase credentials', 'pwp' ), $section_desc );

		foreach ( $fields as $key => $name ) {
			if ( 0 == $cred_set ) {
				pwp_settings()->add_input( $section, $key, $name );
			} else {

				$val = pwp_settings()->get_setting( $key );
				if ( strlen( $val ) > 4 ) {
					//$val = str_repeat( '*', strlen( $val ) - 4 ) . substr( $val, - 4 );
				}
				$phkey   = "$key-placeholder";
				$content = "<input type='text' name='$key' value='$val' disabled/>";
				pwp_settings()->add_message( $section, $phkey, $name, $content );
			}
		}
		if ( $cred_set ) {
			pwp_settings()->add_message( $section, 'remove-firebase-creds', '', '<p style="text-align: right;"><a href="admin.php?action=pwp_remove_firebase_creds&site=' . get_current_blog_id() . '" class="button button-pwpdelete" style="top: -24px; font-size: 12px; position:relative; padding-right: 0;">' . __( 'remove credentials', 'pwp' ) . '</a></p>' );
		}
	}

	public function check_firebase_creds( $data ) {

		if ( get_option( $this->cred_option ) == 'yes' ) {
			return $data;
		}

		if ( ! array_key_exists( 'firebase-serverkey', $data ) || ! array_key_exists( 'firebase-senderid', $data ) ) {
			return $data;
		}

		if ( '' == $data['firebase-serverkey'] || '' == $data['firebase-senderid'] ) {
			return $data;
		}

		/**
		 * validate server key
		 */
		$error       = false;
		$server_key  = $data['firebase-serverkey'];
		$first_block = explode( ':', $server_key )[0];
		if ( 152 != strlen( $server_key ) || 11 != strlen( $first_block ) ) {
			$error = true;
		}

		/**
		 * validate sender ID
		 */
		$data['firebase-senderid'] = intval( $data['firebase-senderid'] );
		if ( 0 == $data['firebase-senderid'] ) {
			$error = true;
		}

		update_option( $this->cred_option, ( $error ? 'error' : 'yes' ) );

		return $data;
	}

	public function remove_firebase_creds() {

		if ( false === current_user_can( pwp_settings()->capability ) ) {
			wp_die( esc_html__( 'Access denied.', 'pwp' ) );
		}

		update_option( $this->cred_option, 'no' );

		$options                       = get_option( 'pwp-settings' );
		$options['firebase-serverkey'] = '';
		$options['firebase-senderid']  = '';

		update_option( 'pwp-settings', $options );
		$sendback = wp_get_referer();
		wp_redirect( esc_url_raw( $sendback ) );
		exit;
	}

	public function creds_error() {

		if ( get_option( $this->cred_option ) != 'error' ) {
			return;
		}

		update_option( $this->cred_option, 'no' );

		$class   = 'notice notice-error';
		$message = __( 'Server Key or Sender ID could not be verified.', 'pwp' );

		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) );
	}

	public function add_sender_id_to_manifest( $args ) {

		if ( get_option( $this->cred_option ) != 'yes' ) {
			return $args;
		}

		$args['gcm_sender_id'] = pwp_get_setting( 'firebase-senderid' );

		return $args;
	}

	/*
	public function do_push( $server_key = '', $fields ) {

		if ( '' == $server_key ) {
			$server_key = pwp_get_setting( 'firebase-serverkey' );
		}

		$headers = [
			'Authorization: key=' . $server_key,
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

		return $result;
	}
	*/
}
