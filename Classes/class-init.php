<?php

namespace nicomartin\ProgressiveWordPress;

class Init {
	public $capability = '';
	public $admin_bar_id = '';
	public $menu_title = '';

	public function __construct() {
		$this->capability   = 'administrator';
		$this->admin_bar_id = pwp_get_instance()->prefix . '-admin-bar';
		$this->menu_title   = __( 'Progressive WP', 'progressive-wp' );
	}

	public function run() {
		// Basics Page
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'pwp_on_activate', function () {
			set_transient( 'pwp-activation-message', true, 5 );
		} );
		add_action( 'pwp_on_update', function ( $old_version, $new_version ) {
			$v = '2.0.0';
			if ( version_compare( $v, $new_version, '<=' ) && version_compare( $v, $old_version, '>' ) ) {
				set_transient( 'pwp-v2-message', true, 5 );
			}
		}, 20, 2 );
		add_action( 'admin_notices', [ $this, 'pwp_message' ] );

		// Plugin Overview
		add_filter( 'plugin_action_links_progressive-wordpress/progressive-wordpress.php', [ $this, 'settings_action_link' ] );
		add_filter( 'plugin_action_links_progressive-wp/progressive-wordpress.php', [ $this, 'settings_action_link' ] );

		// Assets
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );
		add_action( 'wp_head', [ $this, 'add_footer_js_assets' ] );

		// is_ssl() fix for cloudflare: https://snippets.webaware.com.au/snippets/wordpress-is_ssl-doesnt-work-behind-some-load-balancers/
		if ( stripos( get_option( 'siteurl' ), 'https://' ) === 0 ) {
			$_SERVER['HTTPS'] = 'on';
		}

		/**
		 * Default Settings
		 */
		add_action( 'pwp_on_first_activate', [ $this, 'default_settings' ] );
	}

	/**
	 * Basics Page
	 */

	public function add_menu_page() {
		$icon = plugin_dir_url( pwp_get_instance()->file ) . '/assets/img/pwa-menu-icon.png';
		add_menu_page( pwp_get_instance()->name, $this->menu_title, $this->capability, PWP_SETTINGS_PARENT, '', $icon, 100 );
		add_submenu_page( PWP_SETTINGS_PARENT, __( 'About', 'progressive-wp' ), __( 'About', 'progressive-wp' ), $this->capability, PWP_SETTINGS_PARENT, function () {
			?>
			<div class="wrap pwp-wrap mainpage-wrap">
				<h1><?php echo pwp_get_instance()->name ?></h1>
				<div class="pwp-features">
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-installable' ) . ' ' . __( 'Add to homescreen', 'progressive-wp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Provide an <b>integrated</b> user experience!', 'progressive-wp' ); ?></p>
							<p><?php _e( 'Progressive WordPress makes it easy to encourage users to add your website to their homescreen. But that\'s not all. It also allows you to control the display behaviour of your website so it will be shown without any browser elements. Just like a native app.', 'progressive-wp' ); ?></p>
						</div>
						<div class="pwp-features__footer">
							<div class="pwp-features__status">
								<?php
								if ( 'none' == pwp_get_setting( 'installable-mode' ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'You manually set "Show add to homescreen banner" to "never".', 'progressive-wp' ) ) . '">';
									echo pwp_icon( 'close' );
									echo '</span>';
								} elseif ( ! wp_attachment_is_image( intval( get_option( 'site_icon' ) ) ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Please select a Site Icon (Favicon).', 'progressive-wp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} elseif ( wp_get_attachment_image_src( get_option( 'site_icon' ), 'full' )[1] < 192 ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Your Site Icon should be at least 192px.', 'progressive-wp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} else {
									echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( __( 'Your Website matches the Progressive Web App criteria.', 'progressive-wp' ) ) . '">';
									echo pwp_icon( 'check' );
									echo '</span>';
								}
								?>
							</div>
							<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-manifest' ); ?>"><?php _e( 'configure', 'progressive-wp' ); ?></a>
						</div>
					</div>
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-offline' ) . ' ' . __( 'Offline usage', 'progressive-wp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Make your website <b>reliable</b>. Even on flaky internet connections!', 'progressive-wp' ); ?></p>
							<p><?php _e( 'No connection? No problem. Progressive WordPress pre-caches all critical assets of your website, as well as all visited resources. So if there\'s no internet connection it will serve the resources from the local storage. No more error downasaur!', 'progressive-wp' ); ?></p>
						</div>
						<div class="pwp-features__footer">
							<div class="pwp-features__status">
								<?php
								if ( 'page' != get_post_type( pwp_get_setting( 'offline-page' ) ) ) {
									echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Please create and select an offline fallback page', 'progressive-wp' ) ) . '">';
									echo pwp_icon( 'alert' );
									echo '</span>';
								} else {
									// translators: %s = page title
									echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( sprintf( __( '"%s" has been selected as a page for offline fallback. Other resources will be cached automatically.', 'progressive-wp' ), get_the_title( pwp_get_setting( 'offline-page' ) ) ) ) . '">';
									echo pwp_icon( 'check' );
									echo '</span>';
								}
								?>
							</div>
							<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-offlineusage' ); ?>"><?php _e( 'configure', 'progressive-wp' ); ?></a>
						</div>
					</div>
					<div class="pwp-features__element">
						<h2 class="pwp-features__title"><?php echo pwp_icon( 'pwp-push' ) . ' ' . __( 'Push notifications', 'progressive-wp' ) ?></h2>
						<div class="pwp-features__content">
							<p><?php _e( 'Keep your users <b>engaged</b> by sending push notifications!', 'progressive-wp' ); ?></p>
							<?php if ( pwp_onesignal() ) { ?>
								<p><?php printf( __( 'It looks like you are using %s to send push notifications.', 'progressive-wp' ), '<a href="https://onesignal.com" target="_blank">OneSignal</a>' ); ?></p>
								<p><b><?php _e( 'Progressive WordPress is fully compatible with OneSignal!', 'progressive-wp' ) ?></b></p>
							<?php } else { ?>
								<p><?php _e( 'You just published new content and you want to let everyone know? Why not send a push notification? Progressive WordPress has an integrated connection to Firebase that lets you manage registered devices and send push notifications to all or selected devices!', 'progressive-wp' ); ?></p>
							<?php } ?>
						</div>
						<div class="pwp-features__footer">
							<?php if ( pwp_onesignal() ) { ?>
								<div class="pwp-features__status">
									<img style="width: 100px;" src="<?php echo trailingslashit( plugin_dir_url( pwp_get_instance()->file ) ) ?>assets/img/onesignal-logo.svg"/>
								</div>
								<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=onesignal-push' ); ?>"><?php _e( 'OneSignal Settings', 'progressive-wp' ); ?></a>
							<?php } else { ?>
								<div class="pwp-features__status">
									<?php
									if ( ! pwp_push_set() ) {
										echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'Please enter your Firebase cloud messaging credentials to enable push notifications.', 'progressive-wp' ) ) . '">';
										echo pwp_icon( 'alert' );
										echo '</span>';
									} elseif ( empty( get_option( pwp_get_instance()->Push->devices_option ) ) ) {
										echo '<span class="pwp-features__tooltip pwp-features__tooltip--error" data-pwp-features-tooltip="' . esc_attr( __( 'There are no registered devices. You might consider using the built in "Push Button".', 'progressive-wp' ) ) . '">';
										echo pwp_icon( 'alert' );
										echo '</span>';
									} else {
										echo '<span class="pwp-features__tooltip" data-pwp-features-tooltip="' . esc_attr( __( 'All set up. Go ahead and inform your readers.', 'progressive-wp' ) ) . '">';
										echo pwp_icon( 'check' );
										echo '</span>';
									}
									?>
								</div>
								<a class="pwp-features__configure button button--small" href="<?php echo admin_url( 'admin.php?page=pwp-push' ); ?>"><?php _e( 'configure', 'progressive-wp' ); ?></a>
							<?php } ?>
						</div>
					</div>
					<div class="pwp-features__element pwp-features__element--large pwp-features__element--transparent">
						<div class="pwp-features__content">
							<p>
								<b>
									<?php
									// translators: Thank you for using plugin_name
									printf( __( 'Thank you for using %s!', 'progressive-wp' ), pwp_get_instance()->name );
									?>
								</b><br>
								<?php
								// translators: Why it was developed.
								printf( __( 'This plugin was developed by %s to use progressive web app features for your WordPress website.', 'progressive-wp' ), '<a href="https://nicomartin.ch" target="_blank">Nico Martin</a>' );
								?>
							</p>
							<p>
								<?php
								$sw_link = 'https://caniuse.com/#feat=serviceworkers';
								echo __( 'To deliver app-like features this plugin uses a Service Worker. This technology is not yet supported in all browsers!', 'progressive-wp' ) . '</b><br><a href="' . $sw_link . '" target="_blank">' . $sw_link . '</a>';
								?>
							</p>
							<p>
								<?php
								$github = '<a href="https://github.com/nico-martin/progressive-wordpress" target="_blank">GitHub</a>';
								// translators: If you like this plugin feel free to buy me a beer or get involved in the development on GitHub
								printf( __( 'If you like this plugin feel free to get involved with the development on %1$s', 'progressive-wp' ), $github );
								?>
							</p>
						</div>
					</div>
					<div class="pwp-features__element pwp-features__element--transparent">
						<div class="pwp-features__content">
							<p>
								<b style="display: block;">
									<?php _e( 'Need Help?', 'progressive-wp' ); ?>
								</b>
								<?php
								// translators: Please make sure your device supports progressive web apps and the status above is green.
								echo sprintf( __( 'Please make sure your device supports %s.', 'progressive-wp' ), '<a href="https://caniuse.com/#feat=serviceworkers" target="_blank">Progressive Web Apps</a>' ) . ' ';
								// translators: Still not working? Please visit the support forum or contact us.
								printf( __( 'Still not working? Please visit the %1$1s or %2$2s.', 'progressive-wp' ), '<a href="https://wordpress.org/support/plugin/progressive-wp/" target="_blank">' . __( 'support forum', 'progressive-wp' ) . '</a>', '<a href="mailto:hello@sayhello.ch">' . __( 'contact us', 'progressive-wp' ) . '</a>' );
								//echo '<small><b>' . __( 'Attention!', 'progressive-wp' ) . '</b> ' . __( 'The Debug Log contains information that should not be public.', 'progressive-wp' ) . '</small>';
								?>
							</p>
							<p style="text-align: right">
								<?php if ( isset( pwp_get_instance()->Push ) && pwp_get_instance()->Push->latest_push_log() ) { ?>
									<button class="button button--small pwp-download-log" data-log="push-log"><?php _e( 'Download Push-Log', 'progressive-wp' ); ?></button>
								<?php } ?>
								<button class="button button--small pwp-download-log" data-log="debug-log"><?php _e( 'Download Debug-Log', 'progressive-wp' ); ?></button>
							</p>
						</div>
					</div>
				</div>
			</div>
		<?php } );
	}

	public function pwp_message() {
		if ( get_transient( 'pwp-activation-message' ) ) {
			echo '<div class="notice notice-success pwp-activate-notice">';
			echo '<div class="pwp-activate-notice__about">';
			echo '<h3 class="pwp-activate-notice__title">' . pwp_get_instance()->name . '</h3>';
			echo '<p>' . __( 'Welcome to the future! Progressive WordPress makes your website installable, offline ready and lets you send push notifications!', 'progressive-wp' ) . '</p>';
			echo '</div>';
			echo '<a class="pwp-activate-notice__configure button" href="' . admin_url( 'admin.php?page=' . PWP_SETTINGS_PARENT ) . '">' . __( 'Configure', 'progressive-wp' ) . '</a>';
			echo '</div>';
			delete_transient( 'pwp-activation-message' );
		} elseif ( get_transient( 'pwp-v2-message' ) ) {
			echo '<div class="notice notice-success pwp-activate-notice">';
			echo '<div class="pwp-activate-notice__about">';
			// translators: %s = Plugin Name
			echo '<h3 class="pwp-activate-notice__title">' . sprintf( __( '%s Version 2.0 is here!', 'progressive-wp' ), pwp_get_instance()->name ) . '</h3>';
			echo '<p>' . __( 'We are more than happy to announce the biggest update so far! To make it short, we had one big goal: to rewrite the plugin so it fits the needs of non-Developers while it stays very flexble and easy to extend!', 'progressive-wp' ) . '</p>';
			echo '</div>';
			echo '<a class="pwp-activate-notice__configure button" href="https://github.com/SayHelloGmbH/progressive-wordpress#changelog" target="_blank">' . __( 'explore changes', 'progressive-wp' ) . '</a>';
			echo '</div>';
		}
	}

	public function settings_action_link( $links ) {
		return array_merge( [
			'settings' => '<a href="' . admin_url( 'admin.php?page=' . PWP_SETTINGS_PARENT ) . '">' . __( 'Configure', 'progressive-wp' ) . '</a>',
		], $links );
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

		if ( pwp_get_setting( 'offline-indicator' ) ) {
			wp_enqueue_style( pwp_get_instance()->prefix . '-offline-style', $dir_uri . 'assets/styles/ui-offline' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
			wp_enqueue_script( pwp_get_instance()->prefix . '-offline-script', $dir_uri . 'assets/scripts/ui-offline' . ( $min ? '.min' : '' ) . '.js', [], $script_version, true );
		}

		if ( pwp_get_setting( 'firebase-serverkey' ) ) {
			wp_enqueue_style( pwp_get_instance()->prefix . '-pushbutton-style', $dir_uri . 'assets/styles/ui-pushbutton' . ( $min ? '.min' : '' ) . '.css', [], $script_version );
			wp_enqueue_script( 'clientjs', $dir_uri . 'assets/scripts/clientjs.min.js', [], '1.0.0', true );        //wp_enqueue_script( pwp_get_instance()->prefix . '-script', $dir_uri . 'assets/scripts/ui' . ( $min ? '.min' : '' ) . '.js', [ 'jquery', 'clientjs' ], $script_version, true );
			wp_enqueue_script( pwp_get_instance()->prefix . '-pushbutton-script', $dir_uri . 'assets/scripts/ui-pushbutton' . ( $min ? '.min' : '' ) . '.js', [ 'clientjs' ], $script_version, true );
		}

		wp_enqueue_script( pwp_get_instance()->prefix . '-installprompt-script', $dir_uri . 'assets/scripts/ui-installprompt' . ( $min ? '.min' : '' ) . '.js', [], $script_version, true );
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
			'homeurl'      => trailingslashit( get_site_url() ),
			'GeneralError' => __( 'An unexpected error occured', 'progressive-wp' ),
		];

		$vars = json_encode( apply_filters( 'pwp_admin_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-admin-script', "var PwpJsVars = {$vars};", 'before' );
	}

	public function add_footer_js_assets() {
		$defaults = [
			'AjaxURL' => admin_url( 'admin-ajax.php' ),
			'homeurl' => trailingslashit( get_site_url() ),
		];

		$vars = json_encode( apply_filters( 'pwp_footer_js', $defaults ) );
		echo "<script type='text/javascript'>var PwpJsVars = {$vars};</script>";
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
				'manifest-name'             => get_bloginfo( 'name' ),
				'manifest-short-name'       => $short_name,
				'manifest-starturl'         => get_site_url(),
				'manifest-description'      => get_bloginfo( 'description' ),
				'manifest-display'          => 'standalone',
				'manifest-orientation'      => 'portrait',
				'manifest-theme-color'      => '#000000',
				'manifest-background-color' => '#ffffff',
				'tracking-starturl-source'  => 'pwa-homescreen',
				'tracking-pushurl-source'   => 'pwa-pushnotification',
			] );

			pwp_get_instance()->Tracking->utm_parameters();
		}
	}
}
