<?php

namespace nicomartin\ProgressiveWordPress;

class AMP {
	public function run() {

		/**
		 * Manifest
		 */

		add_filter( pwp_get_instance()->Manifest->filter, [ $this, 'amp_start_url' ] );

		/**
		 * Register SW
		 */
		add_filter( 'wp_print_scripts', [ $this, 'amp_enqueue_sw_module' ] );
		add_filter( 'amp_post_template_head', [ $this, 'amp_enqueue_sw_module' ] ); // https://wordpress.org/plugins/accelerated-mobile-pages/
		add_action( 'wp_footer', [ $this, 'amp_register_sw' ] );
		add_action( 'amp_post_template_footer', [ $this, 'amp_register_sw' ] ); // https://wordpress.org/plugins/accelerated-mobile-pages/
		add_action( 'parse_request', [ $this, 'wp_swamp_register' ] );
		add_filter( 'query_vars', [ $this, 'wp_add_swamp_query_var' ] );
	}

	public function amp_start_url( $values ) {
		if ( pwp_get_setting( 'manifest-starturl-amp' ) ) {

			$url = pwp_get_setting( 'manifest-starturl' );

			if ( pwp_supports_amp() == 'amp' && get_home_url() != $url ) {
				$options = get_option( 'amp-options' );
				if ( is_array( $options ) && array_key_exists( 'supported_post_types', $options ) && in_array( 'page', $options['supported_post_types'] ) ) {
					$values['start_url'] = trailingslashit( $url ) . pwp_get_amp_slug() . '/';
				}
			} elseif ( pwp_supports_amp() == 'ampforwp' ) {
				$options = get_option( 'redux_builder_amp' );
				if ( get_home_url() == $url ) {
					if ( array_key_exists( 'ampforwp-homepage-on-off-support', $options ) && $options['ampforwp-homepage-on-off-support'] ) {
						$values['start_url'] = trailingslashit( $url ) . pwp_get_amp_slug() . '/';
					}
				} else {
					if ( array_key_exists( 'amp-on-off-for-all-pages', $options ) && $options['amp-on-off-for-all-pages'] ) {
						$values['start_url'] = trailingslashit( $url ) . pwp_get_amp_slug() . '/';
					}
				}
			}
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
		<amp-install-serviceworker src='<?php echo pwp_get_instance()->ServiceWorker->get_sw_url( false ); ?>' data-iframe-src='<?php echo $this->get_swamp_register_url( false ); ?>>' layout='nodisplay'></amp-install-serviceworker>
		<?php
	}

	public function wp_swamp_register() {
		if ( isset( $GLOBALS['wp']->query_vars['wp_service_worker_amp_register'] ) ) {
			if ( 1 == $GLOBALS['wp']->query_vars['wp_service_worker_amp_register'] ) {
				header( 'Content-Type: text/html; charset=utf-8' );
				?>
				<!doctype html>
				<html>
				<head>
					<title>Installing service worker</title>
					<?php pwp_get_instance()->ServiceWorker->register_sw(); ?>
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

	private function get_swamp_register_url( $encoded = true ) {
		$url = add_query_arg( [
			'wp_service_worker_amp_register' => 1,
		], home_url( '/', 'https' ) );

		if ( $encoded ) {
			return wp_json_encode( $url );
		}

		return $url;
	}
}
