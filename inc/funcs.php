<?php

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

function pwp_settings_page_manifest() {
	return pwp_settings()->add_page( 'manifest', __( 'Installable', 'pwp' ) );
}

function pwp_settings_page_offlineusage() {
	return pwp_settings()->add_page( 'offlineusage', __( 'Offline usage', 'pwp' ) );
}

function pwp_settings_page_push() {
	return pwp_settings()->add_page( 'push', __( 'Push Notifications', 'pwp' ) );
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
