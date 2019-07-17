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

"use strict";


(function (plugin) {

    var active = false;
    var $body = document.getElementsByTagName('body')[0];

    function changePushStatus(status) {
        active = status;
        if (status) {
            $body.classList.add('pwp-notification--on');
        } else {
            $body.classList.remove('pwp-notification--on');
        }
    }

    var registerPushDevice = function registerPushDevice() {
        $body.classList.add('pwp-notification--loader');
        navigator.serviceWorker.ready.then(function (registration) {

            registration.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function (subscription) {
                var subscription_id = subscription.endpoint.split('fcm/send/')[1];
                handleSubscriptionID(subscription_id, 'add');
                changePushStatus(true);
            }).catch(function () {
                changePushStatus(false);
                alert(plugin['message_pushadd_failed']);
            });
        });
    };

    var deregisterPushDevice = function deregisterPushDevice() {
        $body.classList.add('pwp-notification--loader');
        navigator.serviceWorker.ready.then(function (registration) {
            registration.pushManager.getSubscription().then(function (subscription) {
                if (!subscription) {
                    return;
                }
                subscription.unsubscribe().then(function () {
                    var subscription_id = subscription.endpoint.split('fcm/send/')[1];
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
        var clientDatas = [];
        Object.keys(clientData).forEach(function (key) {
            Object.keys(clientData[key]).forEach(function (dataKey) {
                clientDatas.push('clientData[' + key + '][' + dataKey + ']=' + clientData[key][dataKey]);
            });
        });

        var action = 'pwp_ajax_handle_device_id';
        var request = new XMLHttpRequest();
        request.open('POST', plugin['AjaxURL'], true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function () {
            $body.classList.remove('pwp-notification--loader');
        };
        request.send('action=' + action + '&user_id=' + subscription_id + '&handle=' + handle + '&' + clientDatas.join('&'));
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {

        navigator.serviceWorker.ready.then(function (registration) {

            /**
             * Show toggler (hidden by default)
             */

            $body.classList.add('pwp-notification');

            /**
             * add trigger
             */

            var $toggler = document.getElementById('pwp-notification-button');
            if ($toggler) {
                $toggler.onclick = function () {
                    if (active) {
                        deregisterPushDevice();
                    } else {
                        registerPushDevice();
                    }
                };
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

    window.pwpRegisterPushDevice = registerPushDevice;
    window.pwpDeregisterPushDevice = deregisterPushDevice;
})(PwpJsVars);

/***/ })
/******/ ]);