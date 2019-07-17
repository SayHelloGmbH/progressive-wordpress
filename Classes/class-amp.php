<?php

namespace nicomartin\ProgressiveWordPress;

class AMP {
	public function run() {

		/**
		 * Manifest
		 */

		add_filter( pwp_get_instance()->Manifest->filter, [ $this, 'amp_start_url' ] );

		// Skip integrating with AMP plugin's Reader mode templates if on a recent version that directly supports integration with the PWA plugin.
		if ( class_exists( 'AMP_Service_Worker' ) ) {
			add_action( 'amp_post_template_head', [ pwp_get_instance()->Manifest, 'manifest_link_and_meta' ] );

			/**
			 * Register SW
			 */

			add_filter( 'amp_post_template_head', [ $this, 'amp_enqueue_sw_module' ] );
			add_action( 'amp_post_template_footer', [ $this, 'amp_register_sw' ] );
			add_action( 'parse_request', [ $this, 'wp_swamp_register' ] );
			add_filter( 'query_vars', [ $this, 'wp_add_swamp_query_var' ] );
		}
	}

	public function amp_start_url( $values ) {
		if ( pwp_get_setting( 'manifest-starturl-amp' ) ) {
			$url                   = pwp_get_setting( 'manifest-starturl' );
			$values[ 'start_url' ] = apply_filters( 'pwp_get_ampurl_from_url', $url );
		}

		return $values;
	}

	public function amp_enqueue_sw_module() {
		if ( ! pwp_is_amp() ) {
			return;
		}
		?>
		<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"></script>
		<?php
	}

	public function amp_register_sw() {
		if ( ! pwp_is_amp() ) {
			return;
		}
		?>
		<amp-install-serviceworker src='<?php echo pwp_get_instance()->Serviceworker->get_sw_url( false ); ?>' data-iframe-src='<?php echo $this->get_swamp_register_url( false ); ?>>' layout='nodisplay'></amp-install-serviceworker>
		<?php
	}

	public function wp_swamp_register() {
		if ( isset( $GLOBALS[ 'wp' ]->query_vars[ 'wp_service_worker_amp_register' ] ) ) {
			if ( 1 == $GLOBALS[ 'wp' ]->query_vars[ 'wp_service_worker_amp_register' ] ) {
				header( 'Content-Type: text/html; charset=utf-8' );
				?>
				<!doctype html>
				<html>
				<head>
					<title>Installing service worker</title>
					<?php pwp_get_instance()->Serviceworker->register_sw(); ?>
				</head>
				<body>
				</body>
				</html>
				<?php
				exit;
			}
		}
	}

	public function wp_add_swamp_query_var( $query_vars ) {
		$query_vars[] = 'wp_service_worker_amp_register';

		return $query_vars;
	}

	public function get_swamp_register_url( $encoded = true ) {
		$url = add_query_arg( [
			'wp_service_worker_amp_register' => 1,
		], home_url( '/', 'https' ) );

		if ( $encoded ) {
			return wp_json_encode( $url );
		}

		return $url;
	}
}
