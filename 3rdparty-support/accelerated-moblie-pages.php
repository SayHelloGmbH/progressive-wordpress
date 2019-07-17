<?php

/**
 * Plugin support for https://wordpress.org/plugins/accelerated-mobile-pages/
 */

add_action( 'plugins_loaded', function () {

	add_filter( 'pwp_site_supports_amp', '__return_true' );

	add_filter( 'pwp_current_page_is_amp', function ( $is_amp ) {
		if ( function_exists( 'ampforwp_generate_endpoint' ) ) {
			$amp_slug = ampforwp_generate_endpoint();
			$amp_slug = "/{$amp_slug}/";
			$url      = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? "https" : "http" ) . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

			return ( substr( $url, - strlen( $amp_slug ) ) === $amp_slug );
		}

		return $is_amp;
	} );

	add_filter( 'pwp_get_ampurl_from_url', function ( $url ) {

		$options = get_option( 'redux_builder_amp' );
		if ( function_exists( 'ampforwp_generate_endpoint' ) ) {

			$amp_slug = ampforwp_generate_endpoint();
			if ( get_site_url() == $url ) {
				if ( array_key_exists( 'ampforwp-homepage-on-off-support', $options ) && $options['ampforwp-homepage-on-off-support'] ) {
					$url = trailingslashit( $url ) . $amp_slug . '/';
				}
			} else {
				if ( array_key_exists( 'amp-on-off-for-all-pages', $options ) && $options['amp-on-off-for-all-pages'] ) {
					$url = trailingslashit( $url ) . $amp_slug . '/';
				}
			}
		}

		return $url;
	} );
} );
