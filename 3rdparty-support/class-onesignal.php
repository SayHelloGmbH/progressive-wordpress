<?php

namespace nicomartin\ProgressiveWordPress\ThirdParty;

class OneSignal {

	public $os_settings = [];

	public function run() {

		add_action( 'plugins_loaded', [ $this, 'get_os_settings' ] );
		add_action( 'admin_init', [ $this, 'set_os_settings' ] );
		add_filter( pwp_get_instance()->Manifest->filter, [ $this, 'manifest_values' ] );
		add_action( 'pwp_serviceworker', [ $this, 'get_sw_content' ] );
		add_action( 'init', function () {
			remove_action( 'wp_head', [ 'OneSignal_Public', 'onesignal_header' ] );
		} );
		add_action( 'wp_head', [ $this, 'init_onesignal' ] );

		register_deactivation_hook( pwp_get_instance()->file, function () {
			$os_settings                        = \OneSignal::get_onesignal_settings();
			$os_settings['use_custom_manifest'] = false;
			\OneSignal::save_onesignal_settings( $os_settings );
		} );
	}

	public function get_os_settings() {
		$this->os_settings = \OneSignal::get_onesignal_settings();
	}

	public function set_os_settings() {
		$os_settings                        = \OneSignal::get_onesignal_settings();
		$os_settings['use_custom_manifest'] = true;
		$os_settings['custom_manifest_url'] = esc_url( rest_url( pwp_get_instance()->Manifest->rest_namespace . pwp_get_instance()->Manifest->rest_route ) );
		\OneSignal::save_onesignal_settings( $os_settings );
		$this->os_settings = \OneSignal::get_onesignal_settings();
	}

	public function manifest_values( $values ) {

		if ( array_key_exists( 'gcm_sender_id', $this->os_settings ) && $this->os_settings['gcm_sender_id'] ) {
			$gcm_sender_id = $this->os_settings['gcm_sender_id'];
		} else {
			$gcm_sender_id = '482941778795';
		}

		$values['gcm_sender_id']         = $gcm_sender_id;
		$values['gcm_user_visible_only'] = true;

		return $values;
	}

	public function get_sw_content() {
		echo "importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');";
	}

	public function init_onesignal() {
		?>
		<meta name="onesignal" content="wordpress-plugin"/>
		<script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>
		<script>

			window.OneSignal = window.OneSignal || [];

			OneSignal.push(function () {

				OneSignal.SERVICE_WORKER_UPDATER_PATH = "<?php echo pwp_get_instance()->Serviceworker->get_sw_url( false ); ?>";
				OneSignal.SERVICE_WORKER_PATH = "<?php echo pwp_get_instance()->Serviceworker->get_sw_url( false ); ?>";
				OneSignal.SERVICE_WORKER_PARAM = {
					scope: '/'
				};

				<?php

				if ( $this->os_settings['default_icon'] != "" ) {
					echo "OneSignal.setDefaultIcon(\"" . \OneSignalUtils::decode_entities( $this->os_settings['default_icon'] ) . "\");\n";
				}

				if ( $this->os_settings['default_url'] != "" ) {
					echo "OneSignal.setDefaultNotificationUrl(\"" . \OneSignalUtils::decode_entities( $this->os_settings['default_url'] ) . "\");";
				} else {
					echo "OneSignal.setDefaultNotificationUrl(\"" . \OneSignalUtils::decode_entities( get_site_url() ) . "\");\n";
				}
				?>
				var oneSignal_options = {};
				window._oneSignalInitOptions = oneSignal_options;

				<?php
				echo "oneSignal_options['wordpress'] = true;\n";
				echo "oneSignal_options['appId'] = '" . $this->os_settings["app_id"] . "';\n";

				if ( $this->os_settings["prompt_auto_register"] == "1" ) {
					echo "oneSignal_options['autoRegister'] = true;\n";
				} else {
					echo "oneSignal_options['autoRegister'] = false;\n";
				}

				if ( $this->os_settings["use_http_permission_request"] == "1" ) {
					echo "oneSignal_options['httpPermissionRequest'] = { };\n";
					echo "oneSignal_options['httpPermissionRequest']['enable'] = true;\n";

					if ( array_key_exists( 'customize_http_permission_request', $this->os_settings ) && $this->os_settings["customize_http_permission_request"] == "1" ) {
						echo "oneSignal_options['httpPermissionRequest']['modalTitle'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["http_permission_request_modal_title"] ) . "\";\n";
						echo "oneSignal_options['httpPermissionRequest']['modalMessage'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["http_permission_request_modal_message"] ) . "\";\n";
						echo "oneSignal_options['httpPermissionRequest']['modalButtonText'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["http_permission_request_modal_button_text"] ) . "\";\n";
					}
				}

				if ( $this->os_settings["send_welcome_notification"] == "1" ) {
					echo "oneSignal_options['welcomeNotification'] = { };\n";
					echo "oneSignal_options['welcomeNotification']['title'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["welcome_notification_title"] ) . "\";\n";
					echo "oneSignal_options['welcomeNotification']['message'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["welcome_notification_message"] ) . "\";\n";
					if ( $this->os_settings["welcome_notification_url"] != "" ) {
						echo "oneSignal_options['welcomeNotification']['url'] = \"" . \OneSignalUtils::html_safe( $this->os_settings["welcome_notification_url"] ) . "\";\n";
					}
				} else {
					echo "oneSignal_options['welcomeNotification'] = { };\n";
					echo "oneSignal_options['welcomeNotification']['disable'] = true;\n";
				}

				if ( $this->os_settings["subdomain"] != "" ) {
					echo "oneSignal_options['subdomainName'] = \"" . $this->os_settings["subdomain"] . "\";\n";
				} else {
					echo "oneSignal_options['path'] = \"" . $current_plugin_url . "sdk_files/\";\n";
				}

				if ( @$this->os_settings["safari_web_id"] ) {
					echo "oneSignal_options['safari_web_id'] = \"" . $this->os_settings["safari_web_id"] . "\";\n";
				}

				if ( $this->os_settings["persist_notifications"] == "platform-default" ) {
					echo "oneSignal_options['persistNotification'] = false;\n";
				} else if ( $this->os_settings["persist_notifications"] == "yes-all" ) {
					echo "oneSignal_options['persistNotification'] = true;\n";
				}

				echo "oneSignal_options['promptOptions'] = { };\n";
				if ( array_key_exists( 'prompt_customize_enable', $this->os_settings ) && $this->os_settings["prompt_customize_enable"] == "1" ) {
					if ( $this->os_settings["prompt_action_message"] != "" ) {
						echo "oneSignal_options['promptOptions']['actionMessage'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_action_message"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_example_notification_title_desktop"] != "" ) {
						echo "oneSignal_options['promptOptions']['exampleNotificationTitleDesktop'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_example_notification_title_desktop"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_example_notification_message_desktop"] != "" ) {
						echo "oneSignal_options['promptOptions']['exampleNotificationMessageDesktop'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_example_notification_message_desktop"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_example_notification_title_mobile"] != "" ) {
						echo "oneSignal_options['promptOptions']['exampleNotificationTitleMobile'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_example_notification_title_mobile"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_example_notification_message_mobile"] != "" ) {
						echo "oneSignal_options['promptOptions']['exampleNotificationMessageMobile'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_example_notification_message_mobile"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_example_notification_caption"] != "" ) {
						echo "oneSignal_options['promptOptions']['exampleNotificationCaption'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_example_notification_caption"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_accept_button_text"] != "" ) {
						echo "oneSignal_options['promptOptions']['acceptButtonText'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_accept_button_text"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_cancel_button_text"] != "" ) {
						echo "oneSignal_options['promptOptions']['cancelButtonText'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_cancel_button_text"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_site_name"] != "" ) {
						echo "oneSignal_options['promptOptions']['siteName'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_site_name"] ) . "';\n";
					}
					if ( $this->os_settings["prompt_auto_accept_title"] != "" ) {
						echo "oneSignal_options['promptOptions']['autoAcceptTitle'] = '" . \OneSignalUtils::html_safe( $this->os_settings["prompt_auto_accept_title"] ) . "';\n";
					}
				}

				if ( array_key_exists( 'notifyButton_enable', $this->os_settings ) && $this->os_settings["notifyButton_enable"] == "1" ) {
					echo "oneSignal_options['notifyButton'] = { };\n";
					echo "oneSignal_options['notifyButton']['enable'] = true;\n";

					if ( array_key_exists( 'notifyButton_position', $this->os_settings ) && $this->os_settings['notifyButton_position'] != "" ) {
						echo "oneSignal_options['notifyButton']['position'] = '" . $this->os_settings["notifyButton_position"] . "';\n";
					}
					if ( array_key_exists( 'notifyButton_theme', $this->os_settings ) && $this->os_settings['notifyButton_theme'] != "" ) {
						echo "oneSignal_options['notifyButton']['theme'] = '" . $this->os_settings["notifyButton_theme"] . "';\n";
					}
					if ( array_key_exists( 'notifyButton_size', $this->os_settings ) && $this->os_settings['notifyButton_size'] != "" ) {
						echo "oneSignal_options['notifyButton']['size'] = '" . $this->os_settings["notifyButton_size"] . "';\n";
					}

					if ( $this->os_settings["notifyButton_prenotify"] == "1" ) {
						echo "oneSignal_options['notifyButton']['prenotify'] = true;\n";
					} else {
						echo "oneSignal_options['notifyButton']['prenotify'] = false;\n";
					}

					if ( $this->os_settings["notifyButton_showAfterSubscribed"] !== true ) {
						echo "oneSignal_options['notifyButton']['displayPredicate'] = function() { return OneSignal.isPushNotificationsEnabled().then(function(isPushEnabled) { return !isPushEnabled; }); };\n";
					}

					if ( $this->os_settings["use_modal_prompt"] == "1" ) {
						echo "oneSignal_options['notifyButton']['modalPrompt'] = true;\n";
					}

					if ( $this->os_settings["notifyButton_showcredit"] == "1" ) {
						echo "oneSignal_options['notifyButton']['showCredit'] = true;\n";
					} else {
						echo "oneSignal_options['notifyButton']['showCredit'] = false;\n";
					}

					if ( array_key_exists( 'notifyButton_customize_enable', $this->os_settings ) && $this->os_settings["notifyButton_customize_enable"] == "1" ) {
						echo "oneSignal_options['notifyButton']['text'] = {};\n";
						if ( $this->os_settings["notifyButton_message_prenotify"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['message.prenotify'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_message_prenotify"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_tip_state_unsubscribed"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['tip.state.unsubscribed'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_tip_state_unsubscribed"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_tip_state_subscribed"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['tip.state.subscribed'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_tip_state_subscribed"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_tip_state_blocked"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['tip.state.blocked'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_tip_state_blocked"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_message_action_subscribed"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['message.action.subscribed'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_message_action_subscribed"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_message_action_resubscribed"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['message.action.resubscribed'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_message_action_resubscribed"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_message_action_unsubscribed"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['message.action.unsubscribed'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_message_action_unsubscribed"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_dialog_main_title"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['dialog.main.title'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_dialog_main_title"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_dialog_main_button_subscribe"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['dialog.main.button.subscribe'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_dialog_main_button_subscribe"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_dialog_main_button_unsubscribe"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['dialog.main.button.unsubscribe'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_dialog_main_button_unsubscribe"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_dialog_blocked_title"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['dialog.blocked.title'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_dialog_blocked_title"] ) . "';\n";
						}
						if ( $this->os_settings["notifyButton_dialog_blocked_message"] != "" ) {
							echo "oneSignal_options['notifyButton']['text']['dialog.blocked.message'] = '" . \OneSignalUtils::html_safe( $this->os_settings["notifyButton_dialog_blocked_message"] ) . "';\n";
						}
					}

					if ( array_key_exists( 'notifyButton_customize_colors_enable', $this->os_settings ) && $this->os_settings["notifyButton_customize_colors_enable"] == "1" ) {
						echo "oneSignal_options['notifyButton']['colors'] = {};\n";
						if ( $this->os_settings["notifyButton_color_background"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['circle.background'] = '" . $this->os_settings["notifyButton_color_background"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_foreground"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['circle.foreground'] = '" . $this->os_settings["notifyButton_color_foreground"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_badge_background"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['badge.background'] = '" . $this->os_settings["notifyButton_color_badge_background"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_badge_foreground"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['badge.foreground'] = '" . $this->os_settings["notifyButton_color_badge_foreground"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_badge_border"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['badge.bordercolor'] = '" . $this->os_settings["notifyButton_color_badge_border"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_pulse"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['pulse.color'] = '" . $this->os_settings["notifyButton_color_pulse"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_popup_button_background"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['dialog.button.background'] = '" . $this->os_settings["notifyButton_color_popup_button_background"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_popup_button_background_hover"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['dialog.button.background.hovering'] = '" . $this->os_settings["notifyButton_color_popup_button_background_hover"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_popup_button_background_active"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['dialog.button.background.active'] = '" . $this->os_settings["notifyButton_color_popup_button_background_active"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_color_popup_button_color"] != "" ) {
							echo "oneSignal_options['notifyButton']['colors']['dialog.button.foreground'] = '" . $this->os_settings["notifyButton_color_popup_button_color"] . "';\n";
						}
					}

					if ( array_key_exists( 'notifyButton_customize_offset_enable', $this->os_settings ) && $this->os_settings["notifyButton_customize_offset_enable"] == "1" ) {
						echo "oneSignal_options['notifyButton']['offset'] = {};\n";
						if ( $this->os_settings["notifyButton_offset_bottom"] != "" ) {
							echo "oneSignal_options['notifyButton']['offset']['bottom'] = '" . $this->os_settings["notifyButton_offset_bottom"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_offset_left"] != "" ) {
							echo "oneSignal_options['notifyButton']['offset']['left'] = '" . $this->os_settings["notifyButton_offset_left"] . "';\n";
						}
						if ( $this->os_settings["notifyButton_offset_right"] != "" ) {
							echo "oneSignal_options['notifyButton']['offset']['right'] = '" . $this->os_settings["notifyButton_offset_right"] . "';\n";
						}
					}

				}

				$use_custom_sdk_init = $this->os_settings['use_custom_sdk_init'];

				if ( ! $use_custom_sdk_init) {
				if (has_filter( 'onesignal_initialize_sdk' )) {
				onesignal_debug( 'Applying onesignal_initialize_sdk filter.' );
				if (apply_filters( 'onesignal_initialize_sdk', $this->os_settings )) {
				// If the filter returns "$do_initialize_sdk: true", initialize the web SDK
				?>OneSignal.init(window._oneSignalInitOptions);<?php
				} else {
				?>
				/* OneSignal: onesignal_initialize_sdk filter preventing SDK initialization. */
				<?php
				}
				} else {
				if (array_key_exists( 'use_slidedown_permission_message_for_https', $this->os_settings ) && $this->os_settings["use_slidedown_permission_message_for_https"] == "1") {
				?>
				oneSignal_options['autoRegister'] = false;
				OneSignal.showHttpPrompt();
				OneSignal.init(window._oneSignalInitOptions);
				<?php
				} else {
				?>
				OneSignal.init(window._oneSignalInitOptions);
				<?php
				}
				}
				} else {
				?>
				/* OneSignal: Using custom SDK initialization. */
				<?php
				}
				?>
			});

			function documentInitOneSignal() {
				var oneSignal_elements = document.getElementsByClassName("OneSignal-prompt");

				<?php
				if ( $this->os_settings["use_modal_prompt"] == "1" ) {
					echo "var oneSignalLinkClickHandler = function(event) { OneSignal.push(['registerForPushNotifications', {modalPrompt: true}]); event.preventDefault(); };";
				} else {
					echo "var oneSignalLinkClickHandler = function(event) { OneSignal.push(['registerForPushNotifications']); event.preventDefault(); };";
				}
				?>
				for (var i = 0; i < oneSignal_elements.length; i++) {
					oneSignal_elements[i].addEventListener('click', oneSignalLinkClickHandler, false);
				}
			}

			if (document.readyState === 'complete') {
				documentInitOneSignal();
			} else {
				window.addEventListener("load", function (event) {
					documentInitOneSignal();
				});
			}
		</script>
		<?php
	}
}
