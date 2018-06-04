<?php

function pwp_get_notification_button( $attributes = [] ) {
	$dir      = plugin_dir_path( pwp_get_instance()->file ) . 'assets/img/icon/';
	$icon_on  = $dir . 'bell-ring.svg';
	$icon_off = $dir . 'bell-off.svg';
	if ( ! is_file( $icon_on ) || ! is_file( $icon_off ) ) {
		return '';
	}
	$icon_on  = file_get_contents( $icon_on );
	$icon_off = file_get_contents( $icon_off );

	$atts       = apply_filters( 'pwp_notification_button_attributes', $attributes );
	$attributes = [];
	foreach ( $atts as $key => $val ) {
		$key = sanitize_title( $key );
		$val = esc_attr( $val );
		if ( 'class' == $key ) {
			$val = 'notification-button ' . $val;
		}
		$attributes[] = "$key='$val'";
	}

	$attributes = implode( ' ', $attributes );

	$html = '';
	$html .= "<button id='pwp-notification-button' $attributes>";
	$html .= "<span class='notification-button__icon notification-button__icon--on'>$icon_on</span>";
	$html .= "<span class='notification-button__icon notification-button__icon--off'>$icon_off</span>";
	$html .= "<span class='notification-button__icon notification-button__icon--spinner'></span>";
	$html .= '</button>';

	return $html;
}

function pwp_push_set() {
	return ( get_option( 'pwp_firebase_credentials_set' ) == 'yes' );
}

function pwp_exit_ajax( $type, $msg = '', $add = [] ) {

	$return = [
		'type'    => $type,
		'message' => $msg,
		'add'     => $add,
	];

	echo json_encode( $return );

	wp_die();
}

function pwp_get_setting( $key ) {
	return pwp_settings()->get_setting( $key );
}

function pwp_settings_page_main() {
	return pwp_settings()->add_page( PWP_SETTINGS_PARENT, __( 'About', 'pwp' ) );
}

function pwp_settings_page_manifest() {
	return pwp_settings()->add_page( 'pwp-manifest', __( 'Installable', 'pwp' ) );
}

function pwp_settings_page_offlineusage() {
	return pwp_settings()->add_page( 'pwp-offlineusage', __( 'Offline usage', 'pwp' ) );
}

function pwp_settings_page_push() {
	return pwp_settings()->add_page( 'pwp-push', __( 'Push Notifications', 'pwp' ) );
}

function pwp_settings_page_tracking() {
	return pwp_settings()->add_page( 'pwp-tracking', __( 'UTM Tracking', 'pwp' ) );
}

function pwp_register_url( $url ) {

	$home_url  = untrailingslashit( get_home_url() );
	$url_parts = parse_url( $home_url );

	$base_url = $url_parts['scheme'] . '://' . $url_parts['host'];
	if ( strpos( $url, $home_url ) != 0 ) {
		return '';
	}

	return str_replace( $base_url, '', $url );
}

function pwp_put_contents( $file, $content = null ) {

	// Return false if no filename is provided
	if ( empty( $file ) ) {
		return false;
	}

	// Initialize the WP filesystem
	pwp_wp_filesystem_init();
	global $wp_filesystem;

	if ( ! $wp_filesystem->put_contents( $file, $content, 0644 ) ) {
		return false;
	}

	return true;
}

function pwp_delete( $file ) {

	// Return false if no filename is provided
	if ( empty( $file ) ) {
		return false;
	}

	// Initialize the WP filesystem
	pwp_wp_filesystem_init();
	global $wp_filesystem;

	return $wp_filesystem->delete( $file );
}

function pwp_wp_filesystem_init() {

	global $wp_filesystem;

	if ( empty( $wp_filesystem ) ) {
		require_once( trailingslashit( ABSPATH ) . 'wp-admin/includes/file.php' );
		WP_Filesystem();
	}
}
