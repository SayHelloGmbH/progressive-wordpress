/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($, plugin) {

	$(function () {

		var installPromptEvent = void 0;

		if (plugin.installprompt.mode === 'normal') {
			return;
		}

		window.addEventListener('beforeinstallprompt', function (event) {

			// Prevent Chrome <= 67 from automatically showing the prompt
			event.preventDefault();
			installPromptEvent = event;

			if (plugin.installprompt.mode === 'trigger') {

				/**
     * Installable on click
     */

				$(plugin.installprompt.onclick).addClass('installable-active');
				$(plugin.installprompt.onclick).on('click', function () {
					if ($(this).hasClass('installable-active')) {
						installPromptEvent.prompt();
						installPromptEvent.userChoice.then(function (choice) {
							if (choice.outcome === 'accepted') {
								// User accepted the A2HS prompt
							} else {
									// User dismissed the A2HS prompt
								}

							$(plugin.installprompt.onclick).removeClass('installable-active');
							installPromptEvent = null;
						});
					}
				});
			} else {
				installPromptEvent.prompt();
			}
		});
	});
})(jQuery, PwpJsVars);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($, vars) {

	var $body = $('body');
	var offlineClass = 'pwp-offline';

	function updateOnlineStatus(event) {
		if (navigator.onLine) {
			$body.removeClass(offlineClass);
		} else {
			$body.addClass(offlineClass);
		}
	}

	$(function () {
		updateOnlineStatus();
	});

	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
})(jQuery, PwpJsVars);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function ($, plugin) {

	var active = false;
	var $body = $('body');

	$(function () {

		if ('serviceWorker' in navigator && 'PushManager' in window) {

			navigator.serviceWorker.ready.then(function (registration) {

				/**
     * Show toggler (hidden by default)
     */

				$body.addClass('pwp-notification');

				/**
     * add trigger
     */

				var $toggler = $('#pwp-notification-button');
				if ($toggler.length) {
					$toggler.on('click', function () {
						if (active) {
							deregisterPushDevice();
						} else {
							registerPushDevice();
						}
					});
				}

				/**
     * check if is already registered
     */

				registration.pushManager.getSubscription().then(function (subscription) {
					if (subscription) {
						changePushStatus(true);
					}
				});
			});
		}
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

	var registerPushDevice = function registerPushDevice() {
		$body.addClass('pwp-notification--loader');
		navigator.serviceWorker.ready.then(function (registration) {

			registration.pushManager.subscribe({
				userVisibleOnly: true
			}).then(function (subscription) {
				var subscription_id = subscription.endpoint.split('gcm/send/')[1];
				handleSubscriptionID(subscription_id, 'add');
				changePushStatus(true);
			}).catch(function () {
				changePushStatus(false);
				alert(plugin['message_pushadd_failed']);
			});
		});
	};

	var deregisterPushDevice = function deregisterPushDevice() {
		$body.addClass('pwp-notification--loader');
		navigator.serviceWorker.ready.then(function (registration) {
			registration.pushManager.getSubscription().then(function (subscription) {
				if (!subscription) {
					return;
				}
				subscription.unsubscribe().then(function () {
					var subscription_id = subscription.endpoint.split('gcm/send/')[1];
					handleSubscriptionID(subscription_id, 'remove');
					changePushStatus(false);
				}).catch(function () {
					changePushStatus(true);
					alert(plugin['message_pushremove_failed']);
				});
			});
		});
	};

	function handleSubscriptionID(subscription_id, handle) {

		var client = new ClientJS();
		var clientData = {
			'browser': {
				'browser': client.getBrowser(),
				'version': client.getBrowserVersion(),
				'major': client.getBrowserMajorVersion()
			},
			'os': {
				'os': client.getOS(),
				'version': client.getOSVersion()
			},
			'device': {
				'device': client.getDevice(),
				'type': client.getDeviceType(),
				'vendor': client.getDeviceVendor()
			}
		};

		var action = 'pwp_ajax_handle_device_id';

		$.ajax({
			url: plugin['AjaxURL'],
			type: 'POST',
			dataType: 'json',
			data: {
				action: action,
				user_id: subscription_id,
				handle: handle,
				clientData: clientData
			}
		}).done(function (data) {
			//console.log(data);
		});
	}

	window.pwpRegisterPushDevice = registerPushDevice;
	window.pwpDeregisterPushDevice = deregisterPushDevice;
})(jQuery, PwpJsVars);

/***/ })
/******/ ]);