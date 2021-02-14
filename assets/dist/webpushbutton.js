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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/src/ui-webpushbutton/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/ui-webpushbutton/helpers.js":
/*!************************************************!*\
  !*** ./assets/src/ui-webpushbutton/helpers.js ***!
  \************************************************/
/*! exports provided: urlBase64ToUint8Array */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"urlBase64ToUint8Array\", function() { return urlBase64ToUint8Array; });\nvar urlBase64ToUint8Array = function urlBase64ToUint8Array(base64String) {\n  var padding = '='.repeat((4 - base64String.length % 4) % 4);\n  var base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');\n  var rawData = window.atob(base64);\n  var outputArray = new Uint8Array(rawData.length);\n\n  for (var i = 0; i < rawData.length; ++i) {\n    outputArray[i] = rawData.charCodeAt(i);\n  }\n\n  return outputArray;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaGVscGVycy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktd2VicHVzaGJ1dHRvbi9oZWxwZXJzLmpzP2NlYzAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHVybEJhc2U2NFRvVWludDhBcnJheSA9IChiYXNlNjRTdHJpbmcpID0+IHtcbiAgY29uc3QgcGFkZGluZyA9ICc9Jy5yZXBlYXQoKDQgLSAoYmFzZTY0U3RyaW5nLmxlbmd0aCAlIDQpKSAlIDQpO1xuICBjb25zdCBiYXNlNjQgPSAoYmFzZTY0U3RyaW5nICsgcGFkZGluZykucmVwbGFjZSgvXFwtL2csICcrJykuXG4gICAgICByZXBsYWNlKC9fL2csICcvJyk7XG5cbiAgY29uc3QgcmF3RGF0YSA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XG4gIGNvbnN0IG91dHB1dEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3RGF0YS5sZW5ndGgpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmF3RGF0YS5sZW5ndGg7ICsraSkge1xuICAgIG91dHB1dEFycmF5W2ldID0gcmF3RGF0YS5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBvdXRwdXRBcnJheTtcbn07Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/helpers.js\n");

/***/ }),

/***/ "./assets/src/ui-webpushbutton/index.js":
/*!**********************************************!*\
  !*** ./assets/src/ui-webpushbutton/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./push */ \"./assets/src/ui-webpushbutton/push.js\");\n/* harmony import */ var _ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-pushbutton.scss */ \"./assets/src/ui-webpushbutton/ui-pushbutton.scss\");\n/* harmony import */ var _ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1__);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaW5kZXguanM/MjY3YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vcHVzaCc7XG5pbXBvcnQgJy4vdWktcHVzaGJ1dHRvbi5zY3NzJzsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/index.js\n");

/***/ }),

/***/ "./assets/src/ui-webpushbutton/push.js":
/*!*********************************************!*\
  !*** ./assets/src/ui-webpushbutton/push.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./assets/src/ui-webpushbutton/helpers.js\");\n\n\n(function (plugin, WebPushVars) {\n  try {\n    var active = false;\n    var $body = document.getElementsByTagName('body')[0];\n\n    var changePushStatus = function changePushStatus(status) {\n      active = status;\n\n      if (status) {\n        $body.classList.add('pwp-notification--on');\n      } else {\n        $body.classList.remove('pwp-notification--on');\n      }\n    };\n\n    var register = function register() {\n      $body.classList.add('pwp-notification--loader');\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        registration.pushManager.subscribe({\n          userVisibleOnly: true,\n          applicationServerKey: Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"urlBase64ToUint8Array\"])(WebPushVars.vapidPublcKey)\n        }).then(function (subscription) {\n          return addSubscription(subscription).then(function () {\n            return changePushStatus(true);\n          });\n        })[\"catch\"](function () {\n          changePushStatus(false);\n          alert(plugin.message_pushadd_failed);\n        })[\"finally\"](function () {\n          return $body.classList.remove('pwp-notification--loader');\n        });\n      });\n    };\n\n    var deregister = function deregister() {\n      $body.classList.add('pwp-notification--loader');\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        registration.pushManager.getSubscription().then(function (subscription) {\n          if (!subscription) {\n            return;\n          }\n\n          subscription.unsubscribe().then(function () {\n            return removeSubscription(subscription).then(function () {\n              return changePushStatus(false);\n            });\n          })[\"catch\"](function () {\n            changePushStatus(true);\n            alert(plugin['message_pushremove_failed']);\n          })[\"finally\"](function () {\n            return $body.classList.remove('pwp-notification--loader');\n          });\n        });\n      });\n    };\n\n    var addSubscription = function addSubscription(subscription) {\n      return new Promise(function (resolve, reject) {\n        var client = new ClientJS();\n        var clientdata = {\n          browser: {\n            browser: client.getBrowser(),\n            version: client.getBrowserVersion(),\n            major: client.getBrowserMajorVersion()\n          },\n          os: {\n            os: client.getOS(),\n            version: client.getOSVersion()\n          },\n          device: {\n            device: client.getDevice(),\n            type: client.getDeviceType(),\n            vendor: client.getDeviceVendor()\n          }\n        };\n        fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_add_webpush_subscription\"), {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify({\n            subscription: subscription,\n            clientdata: clientdata\n          })\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          return resolve(data);\n        })[\"catch\"](function (e) {\n          reject(e);\n        });\n      });\n    };\n\n    var removeSubscription = function removeSubscription(subscription) {\n      return new Promise(function (resolve, reject) {\n        fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_remove_webpush_subscription\"), {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify({\n            endpoint: subscription.endpoint\n          })\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          return resolve(data);\n        })[\"catch\"](function (e) {\n          reject(e);\n        });\n      });\n    };\n\n    if ('serviceWorker' in navigator && 'PushManager' in window) {\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        /**\n         * Show toggler (hidden by default)\n         */\n        $body.classList.add('pwp-notification');\n        /**\n         * add trigger\n         */\n\n        var $toggler = document.getElementById('pwp-notification-button');\n\n        if ($toggler) {\n          $toggler.onclick = function () {\n            if (active) {\n              deregister();\n            } else {\n              register();\n            }\n          };\n        }\n        /**\n         * check if is already registered\n         */\n\n\n        registration.pushManager.getSubscription().then(function (subscription) {\n          if (subscription) {\n            addSubscription(subscription);\n            changePushStatus(true);\n          }\n        });\n      });\n    }\n\n    window.pwpRegisterPushDevice = registerPushDevice;\n    window.pwpDeregisterPushDevice = deregisterPushDevice;\n  } catch (e) {}\n})(PwpJsVars, WebPushVars);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vcHVzaC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktd2VicHVzaGJ1dHRvbi9wdXNoLmpzP2M2NDgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt1cmxCYXNlNjRUb1VpbnQ4QXJyYXl9IGZyb20gJy4vaGVscGVycyc7XG5cbihmdW5jdGlvbihwbHVnaW4sIFdlYlB1c2hWYXJzKSB7XG4gIHRyeSB7XG4gICAgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICAgIGNvbnN0ICRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblxuICAgIGNvbnN0IGNoYW5nZVB1c2hTdGF0dXMgPSAoc3RhdHVzKSA9PiB7XG4gICAgICBhY3RpdmUgPSBzdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICRib2R5LmNsYXNzTGlzdC5hZGQoJ3B3cC1ub3RpZmljYXRpb24tLW9uJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncHdwLW5vdGlmaWNhdGlvbi0tb24nKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcmVnaXN0ZXIgPSAoKSA9PiB7XG4gICAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdwd3Atbm90aWZpY2F0aW9uLS1sb2FkZXInKTtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT4ge1xuICAgICAgICByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIuc3Vic2NyaWJlKHtcbiAgICAgICAgICB1c2VyVmlzaWJsZU9ubHk6IHRydWUsXG4gICAgICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXk6IHVybEJhc2U2NFRvVWludDhBcnJheShcbiAgICAgICAgICAgICAgV2ViUHVzaFZhcnMudmFwaWRQdWJsY0tleSxcbiAgICAgICAgICApLFxuICAgICAgICB9KS50aGVuKChzdWJzY3JpcHRpb24pID0+XG4gICAgICAgICAgICBhZGRTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uKS50aGVuKCgpID0+IGNoYW5nZVB1c2hTdGF0dXModHJ1ZSkpLFxuICAgICAgICApLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICBjaGFuZ2VQdXNoU3RhdHVzKGZhbHNlKTtcbiAgICAgICAgICBhbGVydChwbHVnaW4ubWVzc2FnZV9wdXNoYWRkX2ZhaWxlZCk7XG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4gJGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncHdwLW5vdGlmaWNhdGlvbi0tbG9hZGVyJykpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRlcmVnaXN0ZXIgPSAoKSA9PiB7XG4gICAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdwd3Atbm90aWZpY2F0aW9uLS1sb2FkZXInKTtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpLnRoZW4oZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgIHJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5nZXRTdWJzY3JpcHRpb24oKS5cbiAgICAgICAgICAgIHRoZW4oZnVuY3Rpb24oc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgIGlmICghc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgIHJlbW92ZVN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24pLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VQdXNoU3RhdHVzKGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICkuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlUHVzaFN0YXR1cyh0cnVlKTtcbiAgICAgICAgICAgICAgICBhbGVydChwbHVnaW5bJ21lc3NhZ2VfcHVzaHJlbW92ZV9mYWlsZWQnXSk7XG4gICAgICAgICAgICAgIH0pLmZpbmFsbHkoKCkgPT5cbiAgICAgICAgICAgICAgICAgICRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3B3cC1ub3RpZmljYXRpb24tLWxvYWRlcicpLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgYWRkU3Vic2NyaXB0aW9uID0gKHN1YnNjcmlwdGlvbikgPT5cbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnRKUygpO1xuICAgICAgICAgIGNvbnN0IGNsaWVudGRhdGEgPSB7XG4gICAgICAgICAgICBicm93c2VyOiB7XG4gICAgICAgICAgICAgIGJyb3dzZXI6IGNsaWVudC5nZXRCcm93c2VyKCksXG4gICAgICAgICAgICAgIHZlcnNpb246IGNsaWVudC5nZXRCcm93c2VyVmVyc2lvbigpLFxuICAgICAgICAgICAgICBtYWpvcjogY2xpZW50LmdldEJyb3dzZXJNYWpvclZlcnNpb24oKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvczoge1xuICAgICAgICAgICAgICBvczogY2xpZW50LmdldE9TKCksXG4gICAgICAgICAgICAgIHZlcnNpb246IGNsaWVudC5nZXRPU1ZlcnNpb24oKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZXZpY2U6IHtcbiAgICAgICAgICAgICAgZGV2aWNlOiBjbGllbnQuZ2V0RGV2aWNlKCksXG4gICAgICAgICAgICAgIHR5cGU6IGNsaWVudC5nZXREZXZpY2VUeXBlKCksXG4gICAgICAgICAgICAgIHZlbmRvcjogY2xpZW50LmdldERldmljZVZlbmRvcigpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZmV0Y2goYCR7cGx1Z2luWydBamF4VVJMJ119P2FjdGlvbj1wd3BfYWpheF9hZGRfd2VicHVzaF9zdWJzY3JpcHRpb25gLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICAgIGNsaWVudGRhdGEsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIH0pLlxuICAgICAgICAgICAgICB0aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKS5cbiAgICAgICAgICAgICAgdGhlbigoZGF0YSkgPT4gcmVzb2x2ZShkYXRhKSkuXG4gICAgICAgICAgICAgIGNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCByZW1vdmVTdWJzY3JpcHRpb24gPSAoc3Vic2NyaXB0aW9uKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgZmV0Y2goXG4gICAgICAgICAgICAgIGAke3BsdWdpblsnQWpheFVSTCddfT9hY3Rpb249cHdwX2FqYXhfcmVtb3ZlX3dlYnB1c2hfc3Vic2NyaXB0aW9uYCxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICBlbmRwb2ludDogc3Vic2NyaXB0aW9uLmVuZHBvaW50LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICkuXG4gICAgICAgICAgICAgIHRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpLlxuICAgICAgICAgICAgICB0aGVuKChkYXRhKSA9PiByZXNvbHZlKGRhdGEpKS5cbiAgICAgICAgICAgICAgY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yICYmICdQdXNoTWFuYWdlcicgaW4gd2luZG93KSB7XG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKS50aGVuKChyZWdpc3RyYXRpb24pID0+IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3cgdG9nZ2xlciAoaGlkZGVuIGJ5IGRlZmF1bHQpXG4gICAgICAgICAqL1xuXG4gICAgICAgICRib2R5LmNsYXNzTGlzdC5hZGQoJ3B3cC1ub3RpZmljYXRpb24nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWRkIHRyaWdnZXJcbiAgICAgICAgICovXG5cbiAgICAgICAgY29uc3QgJHRvZ2dsZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHdwLW5vdGlmaWNhdGlvbi1idXR0b24nKTtcbiAgICAgICAgaWYgKCR0b2dnbGVyKSB7XG4gICAgICAgICAgJHRvZ2dsZXIub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGFjdGl2ZSkge1xuICAgICAgICAgICAgICBkZXJlZ2lzdGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcmVnaXN0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNoZWNrIGlmIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICAgKi9cblxuICAgICAgICByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIuZ2V0U3Vic2NyaXB0aW9uKCkudGhlbigoc3Vic2NyaXB0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgYWRkU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICBjaGFuZ2VQdXNoU3RhdHVzKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB3aW5kb3cucHdwUmVnaXN0ZXJQdXNoRGV2aWNlID0gcmVnaXN0ZXJQdXNoRGV2aWNlO1xuICAgIHdpbmRvdy5wd3BEZXJlZ2lzdGVyUHVzaERldmljZSA9IGRlcmVnaXN0ZXJQdXNoRGV2aWNlO1xuICB9XG4gIGNhdGNoIChlKSB7fVxufSkoUHdwSnNWYXJzLCBXZWJQdXNoVmFycyk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQUE7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFEQTtBQUtBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQVZBO0FBaUJBO0FBRUE7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFGQTtBQUxBO0FBVUE7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFwQ0E7QUFDQTtBQXFDQTtBQUFBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFEQTtBQUxBO0FBVUE7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFuQkE7QUFDQTtBQW9CQTtBQUNBO0FBQ0E7OztBQUlBO0FBRUE7Ozs7QUFJQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/push.js\n");

/***/ }),

/***/ "./assets/src/ui-webpushbutton/ui-pushbutton.scss":
/*!********************************************************!*\
  !*** ./assets/src/ui-webpushbutton/ui-pushbutton.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vdWktcHVzaGJ1dHRvbi5zY3NzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NyYy91aS13ZWJwdXNoYnV0dG9uL3VpLXB1c2hidXR0b24uc2Nzcz9hZTAyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/ui-pushbutton.scss\n");

/***/ })

/******/ });