<?php

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
	return pwp_settings()->add_page( 'manifest', __( 'Manifest', 'pwp' ) );
}

function pwp_settings_page_offlineusage() {
	return pwp_settings()->add_page( 'offlineusage', __( 'Offline usage', 'pwp' ) );
}
