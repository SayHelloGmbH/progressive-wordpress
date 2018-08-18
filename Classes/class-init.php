<?php

namespace nicomartin\ProgressiveWordPress;

class Init {
	public $capability = '';
	public $admin_bar_id = '';
	public $menu_title = '';

	public function __construct() {
		$this->capability   = 'administrator';
		$this->admin_bar_id = pwp_get_instance()->prefix . '-admin-bar';
		$this->menu_title   = __( 'Progressive WP', 'pwp' );
	}

	public function run() {
		// Basics Page
		add_action( 'pwp_settings', [ $this, 'settings_intro' ] );
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );

		// Assets
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );

		// is_ssl() fix for cloudflare: https://snippets.webaware.com.au/snippets/wordpress-is_ssl-doesnt-work-behind-some-load-balancers/
		if ( stripos( get_option( 'siteurl' ), 'https://' ) === 0 ) {
			$_SERVER['HTTPS'] = 'on';
		}

		/**
		 * Default Settings
		 */
		add_action( 'pwp_on_activate', [ $this, 'default_settings' ] );
		//add_action( 'init', [ $this, 'default_settings' ] );
	}

	/**
	 * Basics Page
	 */

	public function settings_intro() {
		$html = '';
		// translators: Thank you for using plugin_name
		$html .= '<p><b>' . sprintf( __( 'Thank you for using %s!', 'pwp' ), pwp_get_instance()->name ) . '</b></p>';
		$html .= '<p>';
		// translators: Why it was developed.
		$html .= sprintf( __( 'This plugin was developed by %s to use progressive web app features for your WordPress website.', 'pwp' ), '<a href="https://nicomartin.ch" target="_blank">Nico Martin</a>' );
		$html .= '</p><p>';
		// translators: feature 1
		$html .= __( 'You are able to create a web-app-manifest, which makes your website installable.', 'pwp' );
		// translators: feature 2
		$html     .= '<br>' . __( 'It also enables offline usage and you are able to send push notifications!', 'pwp' );
		$html     .= '</p>';
		$sw_link  = 'https://caniuse.com/#feat=serviceworkers';
		$html     .= '<p><b>' . __( 'To deliver app-like features this plugin uses a serviceworker.js file. This technology is not yet supported in all browsers!', 'pwp' ) . '</b><br><a href="' . $sw_link . '" target="_blank">' . $sw_link . '</a></p>';
		$buyabeer = '<a href="https://www.paypal.me/NicoMartin" target="_blank">' . __( 'buy me a beer', 'pwp' ) . '</a>';
		$github   = '<a href="https://github.com/nico-martin/progressive-wordpress" target="_blank">GitHub</a>';
		// translators: If you like this plugin feel free to buy me a beer or get involved in the development on GitHub
		$html .= '<p>' . sprintf( __( 'If you like this plugin feel free to %1$s or get involved with the development on %2$s', 'pwp' ), $buyabeer, $github ) . '</p>';

		$section = pwp_settings()->add_section( pwp_settings_page_main(), 'pwp_intro_text', '', $html );
	}

	public function add_menu_page() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, PWP_SETTINGS_PARENT, '', $icon, 100 );
		add_submenu_page( PWP_SETTINGS_PARENT, __( 'About', 'pwp' ), __( 'About', 'pwp' ), $this->capability, PWP_SETTINGS_PARENT, function () {
			?>
			<div class="wrap pwp-wrap mainpage-wrap">
				<h1><?php echo pwp_get_instance()->name ?></h1>
				<div class="pwp-features">
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-installable' ) . ' ' . __( 'Add to homescreen', 'pwp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Provide an <b>integrated</b> user experience!', 'pwp' ); ?></p>
							<p><?php _e( 'Progressive WordPress makes it easy to encurage users to add your website to their homescreen. But thats not all. It also allows you to control the display behaviour of your website so it will be shown without any browser elements. Just like a native app.', 'pwp' ); ?></p>
						</div>
						<div class="pwp-features__footer">
							<div class="pwp-features__status">
								<?php
								if ( 'none' == pwp_get_setting( 'installable-mode' ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'You manually set "Show add to homescreen banner" to "never".', 'pwp' ) ) . '">';
									echo pwp_icon( 'close' );
									echo '</span>';
								} else {
									echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( __( 'Your Website matches the Progressive Web App criteria.', 'pwp' ) ) . '">';
									echo pwp_icon( 'check' );
									echo '</span>';
								}
								?>
							</div>
							<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-manifest' ); ?>"><?php _e( 'configure', 'pwp' ); ?></a>
						</div>
					</div>
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-offline' ) . ' ' . __( 'Offline usage', 'pwp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Make your website <b>reliable</b>. Even on flaky internet connections!', 'pwp' ); ?></p>
							<p><?php _e( 'No connection? No problem. Progressive WordPress pre-caches all critical assets of your website, as well as all visited resources. So if theres no internet connection it will serve the resources from the local storage. No more error pages!', 'pwp' ); ?></p>
						</div>
						<div class="pwp-features__footer">
							<div class="pwp-features__status">
								<?php
								if ( 'page' != get_post_type( pwp_get_setting( 'offline-page' ) ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Please create and select an offline fallback page', 'pwp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} else {
									// translators: %s = page title
									echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( sprintf( __( '"%s" is selected as a page for offline fallback. Other reasources will be cached automatically.', 'pwp' ), get_the_title( pwp_get_setting( 'offline-page' ) ) ) ) . '">';
									echo pwp_icon( 'check' );
									echo '</span>';
								}
								?>
							</div>
							<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-offlineusage' ); ?>"><?php _e( 'configure', 'pwp' ); ?></a>
						</div>
					</div>
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-push' ) . ' ' . __( 'Push notifications', 'pwp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Keep your users <b>engaged</b> by sending push notifications!', 'pwp' ); ?></p>
							<p><?php _e( 'You just published new content and you want to let everyone know? Why not send a push notifications? Progressive WordPress has an integrated connection to Firebase that lets you manage registered devices and send push notifications to all or selected devices!', 'pwp' ); ?></p>
						</div>
						<div class="pwp-features__footer">
							<div class="pwp-features__status">
								<?php
								if ( ! pwp_push_set() ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Please enter your Firebase cloud messaging credentials to enable push notifications.', 'pwp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} elseif ( empty( get_option( pwp_get_instance()->Push->devices_option ) ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'There are no registered devices. You might consider using the built in "Push Button".', 'pwp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} else {
									echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( __( 'All set up. Go ahead and inform your readers.', 'pwp' ) ) . '">';
									echo pwp_icon( 'check' );
									echo '</span>';
								}
								?>
							</div>
							<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-push' ); ?>"><?php _e( 'configure', 'pwp' ); ?></a>
						</div>
					</div>
				</div>
			</div>
		<?php } );
	}

	public function main_page() {
		echo 'test';
	}

	/**
	 * Assets
	 */
	public function add_assets() {
		$script_version = pwp_get_instance()->version;
		$min            = true;
		if ( pwp_get_instance()->debug ) {
			$min = false;
		}
		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_script( 'clientjs', $dir_uri . 'assets/scripts/clientjs.min.js', [], '1.0.0', true );

		wp_enqueue_style( pwp_get_instance()->prefix . '-style', $dir_uri . 'assets/styles/ui' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-script', $dir_uri . 'assets/scripts/ui' . ( $min ? '.min' : '' ) . '.js', [ 'jquery', 'clientjs' ], $script_version, true );

		/**
		 * Footer JS
		 */

		$defaults = [
			'AjaxURL' => admin_url( 'admin-ajax.php' ),
			'homeurl' => trailingslashit( get_home_url() ),
		];

		$vars = json_encode( apply_filters( 'pwp_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-script', "var PwpJsVars = {$vars};", 'before' );
	}

	public function add_admin_assets() {
		$script_version = pwp_get_instance()->version;
		$min            = true;
		if ( pwp_get_instance()->debug && is_user_logged_in() ) {
			$min = false;
		}

		wp_enqueue_style( 'wp-color-picker' );
		wp_enqueue_script( 'wp-color-picker' );

		$dir_uri = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
		wp_enqueue_style( pwp_get_instance()->prefix . '-admin-style', $dir_uri . 'assets/styles/admin' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
		wp_enqueue_script( pwp_get_instance()->prefix . '-admin-script', $dir_uri . 'assets/scripts/admin' . ( $min ? '.min' : '' ) . '.js', [ 'jquery' ], $script_version, true );

		/**
		 * Admin Footer JS
		 */

		$defaults = [
			'AjaxURL'      => admin_url( 'admin-ajax.php' ),
			'homeurl'      => trailingslashit( get_home_url() ),
			'GeneralError' => __( 'An unexpected error occured', 'pwp' ),
		];

		$vars = json_encode( apply_filters( 'pwp_admin_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-admin-script', "var PwpJsVars = {$vars};", 'before' );
	}

	/**
	 * Default Settings
	 */
	public function default_settings() {
		$options = get_option( pwp_settings()->option_key, false );
		if ( ! $options ) {

			$short_name = get_bloginfo( 'name' );
			if ( strlen( $short_name ) > 12 ) {
				$short_name = substr( $short_name, 0, 9 ) . '...';
			}

			update_option( pwp_settings()->option_key, [
				'installable-enabled'       => '1',
				'manifest-name'             => get_bloginfo( 'name' ),
				'manifest-short-name'       => $short_name,
				'manifest-starturl'         => './',
				'manifest-description'      => get_bloginfo( 'description' ),
				'manifest-display'          => 'standalone',
				'manifest-orientation'      => 'portrait',
				'manifest-theme-color'      => '#000000',
				'manifest-background-color' => '#ffffff',
				'offline-enabled'           => 1,
				'offline-content'           => '',
				'tracking-starturl-source'  => 'pwa-homescreen',
				'tracking-pushurl-source'   => 'pwa-pushnotification',
			] );

			pwp_get_instance()->Tracking->utm_parameters();
		}
	}
}
