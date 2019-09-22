<?php

namespace nicomartin\ProgressiveWordPress;

class Serviceworker {

	public $capability = '';
	public $sw_query_var = 'wp_service_worker';
	public $sw_path = '';
	public $sw_url = '';

	public function __construct() {
		$this->capability = pwp_get_instance()->Init->capability;
	}

	public function run() {
		add_action( 'admin_notices', [ $this, 'ssl_error_notice' ] );
		add_action( 'wp_head', [ $this, 'unregister_pwp_sw' ] );

		// if https://github.com/xwp/pwa-wp
		add_action( 'plugins_loaded', [ $this, 'register_service_worker' ] );

		// if not https://github.com/xwp/pwa-wp
		add_action( 'parse_request', [ $this, 'wp_return_sw' ] );
		add_filter( 'query_vars', [ $this, 'wp_add_service_worker_query_var' ] );

		add_action( 'wp_head', [ $this, 'register_sw' ] );
		/*
		foreach ( [ 'wp_print_scripts', 'admin_print_scripts', 'customize_controls_print_scripts', 'login_footer', 'after_signup_form', 'activate_wp_head' ] as $filter ) {
			add_filter( $filter, [ $this, 'register_sw' ], 9 );
		}
		*/
	}

	public function ssl_error_notice() {

		if ( is_ssl() ) {
			return;
		}

		$screen = get_current_screen();
		if ( PWP_SETTINGS_PARENT != $screen->parent_base ) {
			return;
		}

		echo '<div class="notice notice-error">';
		echo '<p>' . __( 'Your site has to be served over https to use progressive web app features.', 'progressive-wp' ) . '</p>';
		echo '</div>';
	}

	public function unregister_pwp_sw() {
		if ( ! isset( $_SERVER['HTTPS'] ) ) {
			return;
		}
		?>
		<script type="text/javascript" id="serviceworker-unregister">
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.getRegistrations().then(function (registrations) {
					registrations.forEach(function (registration) {
						if (registration.active.scriptURL === window.location.origin + '/pwp-serviceworker.js') {
							registration.unregister();
						}
					});
				});
			}
		</script>
		<?php
	}

	/**
	 * if https://github.com/xwp/pwa-wp
	 */

	public function register_service_worker() {
		if ( function_exists( 'wp_register_service_worker' ) && file_exists( $this->sw_path ) ) {
			wp_register_service_worker( 'progressive-wp-offline-sw', function () {
				return pwp_get_instance()->Offlineusage->get_sw_content();
			}, [], \WP_Service_Workers::SCOPE_FRONT );
			wp_register_service_worker( 'progressive-wp-push-sw', function () {
				return pwp_get_instance()->Push->get_sw_content();
			}, [], \WP_Service_Workers::SCOPE_FRONT );
		}
	}

	/**
	 * if not https://github.com/xwp/pwa-wp
	 */

	public function wp_return_sw() {
		if ( function_exists( 'wp_register_service_worker' ) ) {
			return;
		}
		if ( isset( $GLOBALS['wp']->query_vars['wp_service_worker'] ) ) {
			if ( 1 == $GLOBALS['wp']->query_vars['wp_service_worker'] ) {
				header( 'Content-Type: text/javascript; charset=utf-8' );
				echo "/* PWP register */\n";
				do_action( 'pwp_serviceworker' );
				exit;
			}
		}
	}

	public function wp_add_service_worker_query_var( $query_vars ) {
		if ( function_exists( 'wp_register_service_worker' ) ) {
			return $query_vars;
		}
		$query_vars[] = 'wp_service_worker';

		return $query_vars;
	}

	public function register_sw() {
		if ( pwp_is_amp() ) {
			return;
		}
		if ( function_exists( 'wp_register_service_worker' ) ) {
			return;
		}
		$home_url       = trailingslashit( get_site_url() );
		$home_url_parts = parse_url( $home_url );
		$path           = '/';
		if ( array_key_exists( 'path', $home_url_parts ) ) {
			$path = $home_url_parts['path'];
		}
		?>
		<script type="text/javascript" id="serviceworker">
			if (navigator.serviceWorker) {
				window.addEventListener('load', function () {
					navigator.serviceWorker.register(
						<?php echo $this->get_sw_url(); ?>, {"scope": "<?php echo str_replace( '/', '\/', $path ); ?>"}
					);
				});
			}
		</script>
		<?php
	}

	/**
	 * Helpers
	 */

	public function get_sw_url( $encoded = true ) {
		$url = add_query_arg( [
			'wp_service_worker' => 1,
		], home_url( '/', 'https' ) );

		if ( $encoded ) {
			return wp_json_encode( $url );
		}

		return $url;
	}
}
