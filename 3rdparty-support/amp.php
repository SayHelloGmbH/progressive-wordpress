<?php

/**
 * Plugin support for https://wordpress.org/plugins/amp/
 */

add_action( 'plugins_loaded', function () {

	add_filter( 'pwp_site_supports_amp', '__return_true' );

	add_filter( 'pwp_current_page_is_amp', function ( $is_amp ) {
		if ( function_exists( 'amp_get_slug' ) ) {
			$amp_slug = amp_get_slug();
			$amp_slug = "/{$amp_slug}/";
			$url      = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? "https" : "http" ) . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

			return ( substr( $url, - strlen( $amp_slug ) ) === $amp_slug );
		}

		return $is_amp;
	} );

	add_filter( 'pwp_get_ampurl_from_url', function ( $url ) {

		if ( pwp_supports_amp() == 'amp' && get_site_url() != $url ) {
			$options = get_option( 'amp-options' );
			if ( is_array( $options ) && array_key_exists( 'supported_post_types', $options ) && in_array( 'page', $options['supported_post_types'] ) ) {
				$url = trailingslashit( $url ) . pwp_get_amp_slug() . '/';
			}
		}

		return $url;
	} );
} );