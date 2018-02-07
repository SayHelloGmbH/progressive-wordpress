import 'clientjs';

(function ($, plugin) {

	let active = false;
	const $toggler = $('#pwp-notification-button');
	const $body = $('body');

	$(function () {

		/*
		$toggler.on('click', function () {
			if ($body.hasClass('pwp-notification--on')) {
				$body.removeClass('pwp-notification--on');
				$body.addClass('pwp-notification--loader');
			} else if ($body.hasClass('pwp-notification--loader')) {
				$body.removeClass('pwp-notification--on');
				$body.removeClass('pwp-notification--loader');
			} else {
				$body.addClass('pwp-notification--on');
				$body.removeClass('pwp-notification--loader');
			}
		});
		$body.addClass('pwp-notification');
		return;
		*/

		if (!'serviceWorker' in navigator || !'PushManager' in window) {
			return;
		}

		navigator.serviceWorker.ready
			.then(function (registration) {

				/**
				 * Show toggler (hidden by default)
				 */

				$body.addClass('pwp-notification');

				/**
				 * add trigger
				 */

				$toggler.on('click', function () {
					if (active) {
						deregisterPushDevice();
					} else {
						registerPushDevice();
					}
				});

				/**
				 * check if is already registered
				 */

				registration.pushManager.getSubscription()
					.then(function (subscription) {
						if (subscription) {
							changePushStatus(true);
						}
					});
			});
	});

	function changePushStatus(status) {
		active = status;
		$body.removeClass('pwp-notification--loader');
		if (status) {
			$body.addClass('pwp-notification--on');
		} else {
			$body.removeClass('pwp-notification--on');
		}
	}

	const registerPushDevice = function () {
		$body.addClass('pwp-notification--loader');
		navigator.serviceWorker.ready
			.then(function (registration) {

				registration.pushManager.subscribe({
					userVisibleOnly: true
				})
					.then(function (subscription) {
						const subscription_id = subscription.endpoint.split('gcm/send/')[1];
						handleSubscriptionID(subscription_id, 'add');
						changePushStatus(true);
					})
					.catch(function () {
						changePushStatus(false);
						alert(plugin['message_pushadd_failed']);
					});
			});
	};

	const deregisterPushDevice = function () {
		$body.addClass('pwp-notification--loader');
		navigator.serviceWorker.ready
			.then(function (registration) {
				registration.pushManager.getSubscription()
					.then(function (subscription) {
						if (!subscription) {
							return;
						}
						subscription.unsubscribe()
							.then(function () {
								const subscription_id = subscription.endpoint.split('gcm/send/')[1];
								handleSubscriptionID(subscription_id, 'remove');
								changePushStatus(false);
							})
							.catch(function () {
								changePushStatus(true);
								alert(plugin['message_pushremove_failed']);
							});
					});
			});
	};

	function handleSubscriptionID(subscription_id, handle) {

		const client = new ClientJS();
		const clientData = {
			'browser': {
				'browser': client.getBrowser(),
				'version': client.getBrowserVersion(),
				'major': client.getBrowserMajorVersion(),
			},
			'os': {
				'os': client.getOS(),
				'version': client.getOSVersion(),
			},
			'device': {
				'device': client.getDevice(),
				'type': client.getDeviceType(),
				'vendor': client.getDeviceVendor()
			}
		};

		const action = 'pwp_ajax_handle_device_id';

		$.ajax({
			url: plugin['AjaxURL'],
			type: 'POST',
			dataType: 'json',
			data: {
				action: action,
				user_id: subscription_id,
				handle: handle,
				clientData: clientData,
			}
		}).done(function (data) {
			//console.log(data);
		});
	}

	window.registerPushDevice = registerPushDevice;
	window.deregisterPushDevice = deregisterPushDevice;

})(jQuery, PwpJsVars);