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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"urlBase64ToUint8Array\", function() { return urlBase64ToUint8Array; });\nvar urlBase64ToUint8Array = function urlBase64ToUint8Array(base64String) {\n  var padding = '='.repeat((4 - base64String.length % 4) % 4);\n  var base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');\n  var rawData = window.atob(base64);\n  var outputArray = new Uint8Array(rawData.length);\n\n  for (var i = 0; i < rawData.length; ++i) {\n    outputArray[i] = rawData.charCodeAt(i);\n  }\n\n  return outputArray;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaGVscGVycy5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktd2VicHVzaGJ1dHRvbi9oZWxwZXJzLmpzP2NlYzAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHVybEJhc2U2NFRvVWludDhBcnJheSA9IChiYXNlNjRTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYWRkaW5nID0gJz0nLnJlcGVhdCgoNCAtIChiYXNlNjRTdHJpbmcubGVuZ3RoICUgNCkpICUgNCk7XHJcbiAgY29uc3QgYmFzZTY0ID0gKGJhc2U2NFN0cmluZyArIHBhZGRpbmcpLnJlcGxhY2UoL1xcLS9nLCAnKycpLlxyXG4gICAgICByZXBsYWNlKC9fL2csICcvJyk7XHJcblxyXG4gIGNvbnN0IHJhd0RhdGEgPSB3aW5kb3cuYXRvYihiYXNlNjQpO1xyXG4gIGNvbnN0IG91dHB1dEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3RGF0YS5sZW5ndGgpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd0RhdGEubGVuZ3RoOyArK2kpIHtcclxuICAgIG91dHB1dEFycmF5W2ldID0gcmF3RGF0YS5jaGFyQ29kZUF0KGkpO1xyXG4gIH1cclxuICByZXR1cm4gb3V0cHV0QXJyYXk7XHJcbn07Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/helpers.js\n");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./assets/src/ui-webpushbutton/helpers.js\");\n\n\n(function (plugin, WebPushVars) {\n  try {\n    var handleSubscriptionID = function handleSubscriptionID(subscription, handle) {\n      /*\n          const clientDatas = [];\n          Object.keys(clientData).forEach(function(key) {\n            Object.keys(clientData[key]).forEach(function(dataKey) {\n              clientDatas.push(\n                  `clientData[${key}][${dataKey}]=${clientData[key][dataKey]}`);\n            });\n          });*/\n      console.log('POST', {\n        subscription: subscription,\n        clientData: clientData,\n        handle: handle\n      });\n      fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_handle_webpush_subscription\"), {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          subscription: subscription,\n          clientData: clientData,\n          handle: handle\n        })\n      }).then(function (response) {\n        return response.json();\n      }).then(function (data) {\n        return console.log(data);\n      }); // todo: add subscription\n\n      /*\n        const action = 'pwp_ajax_handle_device_id';\n        const request = new XMLHttpRequest();\n        request.open('POST', plugin['AjaxURL'], true);\n        request.setRequestHeader('Content-Type',\n            'application/x-www-form-urlencoded; charset=UTF-8');\n        request.onload = function() {\n          $body.classList.remove('pwp-notification--loader');\n        };\n        request.send(\n            `action=${action}&user_id=${subscription_id}&handle=${handle}&${clientDatas.join(\n                '&')}`);\n            */\n    };\n\n    var active = false;\n    var $body = document.getElementsByTagName('body')[0];\n\n    var changePushStatus = function changePushStatus(status) {\n      active = status;\n\n      if (status) {\n        $body.classList.add('pwp-notification--on');\n      } else {\n        $body.classList.remove('pwp-notification--on');\n      }\n    };\n\n    var register = function register() {\n      $body.classList.add('pwp-notification--loader');\n      console.log('WebPushVars.vapidPublcKey', WebPushVars.vapidPublcKey);\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        registration.pushManager.subscribe({\n          userVisibleOnly: true,\n          applicationServerKey: Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"urlBase64ToUint8Array\"])(WebPushVars.vapidPublcKey)\n        }).then(function (subscription) {\n          return addSubscription(subscription).then(function () {\n            return changePushStatus(true);\n          });\n        })[\"catch\"](function () {\n          changePushStatus(false);\n          alert(plugin.message_pushadd_failed);\n        })[\"finally\"](function () {\n          return $body.classList.remove('pwp-notification--loader');\n        });\n      });\n    };\n\n    var deregister = function deregister() {\n      $body.classList.add('pwp-notification--loader');\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        registration.pushManager.getSubscription().then(function (subscription) {\n          if (!subscription) {\n            return;\n          }\n\n          subscription.unsubscribe().then(function () {\n            return removeSubscription(subscription).then(function () {\n              return changePushStatus(false);\n            });\n          })[\"catch\"](function () {\n            changePushStatus(true);\n            alert(plugin['message_pushremove_failed']);\n          })[\"finally\"](function () {\n            return $body.classList.remove('pwp-notification--loader');\n          });\n        });\n      });\n    };\n\n    var addSubscription = function addSubscription(subscription) {\n      return new Promise(function (resolve, reject) {\n        var client = new ClientJS();\n        var clientdata = {\n          browser: {\n            browser: client.getBrowser(),\n            version: client.getBrowserVersion(),\n            major: client.getBrowserMajorVersion()\n          },\n          os: {\n            os: client.getOS(),\n            version: client.getOSVersion()\n          },\n          device: {\n            device: client.getDevice(),\n            type: client.getDeviceType(),\n            vendor: client.getDeviceVendor()\n          }\n        };\n        fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_add_webpush_subscription\"), {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify({\n            subscription: subscription,\n            clientdata: clientdata\n          })\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          return resolve(data);\n        })[\"catch\"](function (e) {\n          reject(e);\n        });\n      });\n    };\n\n    var removeSubscription = function removeSubscription(subscription) {\n      return new Promise(function (resolve, reject) {\n        fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_remove_webpush_subscription\"), {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify({\n            endpoint: subscription.endpoint\n          })\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          return resolve(data);\n        })[\"catch\"](function (e) {\n          reject(e);\n        });\n      });\n    };\n\n    if ('serviceWorker' in navigator && 'PushManager' in window) {\n      navigator.serviceWorker.getRegistration().then(function (registration) {\n        /**\n         * Show toggler (hidden by default)\n         */\n        $body.classList.add('pwp-notification');\n        /**\n         * add trigger\n         */\n\n        var $toggler = document.getElementById('pwp-notification-button');\n\n        if ($toggler) {\n          $toggler.onclick = function () {\n            if (active) {\n              deregister();\n            } else {\n              register();\n            }\n          };\n        }\n        /**\n         * check if is already registered\n         */\n\n\n        registration.pushManager.getSubscription().then(function (subscription) {\n          console.log('SUBSCRIPTION', subscription);\n\n          if (subscription) {\n            addSubscription(subscription);\n            changePushStatus(true);\n          }\n        });\n      });\n    }\n\n    window.pwpRegisterPushDevice = registerPushDevice;\n    window.pwpDeregisterPushDevice = deregisterPushDevice;\n  } catch (e) {}\n})(PwpJsVars, WebPushVars);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vcHVzaC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktd2VicHVzaGJ1dHRvbi9wdXNoLmpzP2M2NDgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt1cmxCYXNlNjRUb1VpbnQ4QXJyYXl9IGZyb20gJy4vaGVscGVycyc7XG5cbihmdW5jdGlvbihwbHVnaW4sIFdlYlB1c2hWYXJzKSB7XG4gIHRyeSB7XG4gICAgbGV0IGFjdGl2ZSA9IGZhbHNlO1xuICAgIGNvbnN0ICRib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcblxuICAgIGNvbnN0IGNoYW5nZVB1c2hTdGF0dXMgPSAoc3RhdHVzKSA9PiB7XG4gICAgICBhY3RpdmUgPSBzdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICRib2R5LmNsYXNzTGlzdC5hZGQoJ3B3cC1ub3RpZmljYXRpb24tLW9uJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwd3Atbm90aWZpY2F0aW9uLS1vbicpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZWdpc3RlciA9ICgpID0+IHtcbiAgICAgICRib2R5LmNsYXNzTGlzdC5hZGQoJ3B3cC1ub3RpZmljYXRpb24tLWxvYWRlcicpO1xuICAgICAgY29uc29sZS5sb2coJ1dlYlB1c2hWYXJzLnZhcGlkUHVibGNLZXknLCBXZWJQdXNoVmFycy52YXBpZFB1YmxjS2V5KTtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT4ge1xuICAgICAgICByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIuc3Vic2NyaWJlKHtcbiAgICAgICAgICB1c2VyVmlzaWJsZU9ubHk6IHRydWUsXG4gICAgICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXk6IHVybEJhc2U2NFRvVWludDhBcnJheShcbiAgICAgICAgICAgICAgV2ViUHVzaFZhcnMudmFwaWRQdWJsY0tleSxcbiAgICAgICAgICApLFxuICAgICAgICB9KS50aGVuKChzdWJzY3JpcHRpb24pID0+XG4gICAgICAgICAgICBhZGRTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uKS50aGVuKCgpID0+IGNoYW5nZVB1c2hTdGF0dXModHJ1ZSkpLFxuICAgICAgICApLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICBjaGFuZ2VQdXNoU3RhdHVzKGZhbHNlKTtcbiAgICAgICAgICBhbGVydChwbHVnaW4ubWVzc2FnZV9wdXNoYWRkX2ZhaWxlZCk7XG4gICAgICAgIH0pLmZpbmFsbHkoKCkgPT4gJGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncHdwLW5vdGlmaWNhdGlvbi0tbG9hZGVyJykpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRlcmVnaXN0ZXIgPSAoKSA9PiB7XG4gICAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdwd3Atbm90aWZpY2F0aW9uLS1sb2FkZXInKTtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpLnRoZW4oZnVuY3Rpb24ocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgIHJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlci5nZXRTdWJzY3JpcHRpb24oKS50aGVuKGZ1bmN0aW9uKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgIGlmICghc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpLnRoZW4oKCkgPT5cbiAgICAgICAgICAgICAgcmVtb3ZlU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbikudGhlbigoKSA9PlxuICAgICAgICAgICAgICAgICAgY2hhbmdlUHVzaFN0YXR1cyhmYWxzZSksXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgKS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYW5nZVB1c2hTdGF0dXModHJ1ZSk7XG4gICAgICAgICAgICBhbGVydChwbHVnaW5bJ21lc3NhZ2VfcHVzaHJlbW92ZV9mYWlsZWQnXSk7XG4gICAgICAgICAgfSkuZmluYWxseSgoKSA9PlxuICAgICAgICAgICAgICAkYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwd3Atbm90aWZpY2F0aW9uLS1sb2FkZXInKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBhZGRTdWJzY3JpcHRpb24gPSAoc3Vic2NyaXB0aW9uKSA9PlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudEpTKCk7XG4gICAgICAgICAgY29uc3QgY2xpZW50ZGF0YSA9IHtcbiAgICAgICAgICAgIGJyb3dzZXI6IHtcbiAgICAgICAgICAgICAgYnJvd3NlcjogY2xpZW50LmdldEJyb3dzZXIoKSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogY2xpZW50LmdldEJyb3dzZXJWZXJzaW9uKCksXG4gICAgICAgICAgICAgIG1ham9yOiBjbGllbnQuZ2V0QnJvd3Nlck1ham9yVmVyc2lvbigpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9zOiB7XG4gICAgICAgICAgICAgIG9zOiBjbGllbnQuZ2V0T1MoKSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogY2xpZW50LmdldE9TVmVyc2lvbigpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRldmljZToge1xuICAgICAgICAgICAgICBkZXZpY2U6IGNsaWVudC5nZXREZXZpY2UoKSxcbiAgICAgICAgICAgICAgdHlwZTogY2xpZW50LmdldERldmljZVR5cGUoKSxcbiAgICAgICAgICAgICAgdmVuZG9yOiBjbGllbnQuZ2V0RGV2aWNlVmVuZG9yKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmZXRjaChgJHtwbHVnaW5bJ0FqYXhVUkwnXX0/YWN0aW9uPXB3cF9hamF4X2FkZF93ZWJwdXNoX3N1YnNjcmlwdGlvbmAsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICAgY2xpZW50ZGF0YSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgfSkuXG4gICAgICAgICAgICAgIHRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpLlxuICAgICAgICAgICAgICB0aGVuKChkYXRhKSA9PiByZXNvbHZlKGRhdGEpKS5cbiAgICAgICAgICAgICAgY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIGNvbnN0IHJlbW92ZVN1YnNjcmlwdGlvbiA9IChzdWJzY3JpcHRpb24pID0+XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBmZXRjaChcbiAgICAgICAgICAgICAgYCR7cGx1Z2luWydBamF4VVJMJ119P2FjdGlvbj1wd3BfYWpheF9yZW1vdmVfd2VicHVzaF9zdWJzY3JpcHRpb25gLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgIGVuZHBvaW50OiBzdWJzY3JpcHRpb24uZW5kcG9pbnQsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgKS5cbiAgICAgICAgICAgICAgdGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSkuXG4gICAgICAgICAgICAgIHRoZW4oKGRhdGEpID0+IHJlc29sdmUoZGF0YSkpLlxuICAgICAgICAgICAgICBjYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3Vic2NyaXB0aW9uSUQoc3Vic2NyaXB0aW9uLCBoYW5kbGUpIHtcbiAgICAgIC8qXG4gICAgICAgICAgY29uc3QgY2xpZW50RGF0YXMgPSBbXTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhjbGllbnREYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoY2xpZW50RGF0YVtrZXldKS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGFLZXkpIHtcbiAgICAgICAgICAgICAgY2xpZW50RGF0YXMucHVzaChcbiAgICAgICAgICAgICAgICAgIGBjbGllbnREYXRhWyR7a2V5fV1bJHtkYXRhS2V5fV09JHtjbGllbnREYXRhW2tleV1bZGF0YUtleV19YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTsqL1xuXG4gICAgICBjb25zb2xlLmxvZygnUE9TVCcsIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uLFxuICAgICAgICBjbGllbnREYXRhLFxuICAgICAgICBoYW5kbGUsXG4gICAgICB9KTtcblxuICAgICAgZmV0Y2goXG4gICAgICAgICAgYCR7cGx1Z2luWydBamF4VVJMJ119P2FjdGlvbj1wd3BfYWpheF9oYW5kbGVfd2VicHVzaF9zdWJzY3JpcHRpb25gLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLFxuICAgICAgICAgICAgICBjbGllbnREYXRhLFxuICAgICAgICAgICAgICBoYW5kbGUsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgKS50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKS50aGVuKChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhKSk7XG5cbiAgICAgIC8vIHRvZG86IGFkZCBzdWJzY3JpcHRpb25cblxuICAgICAgLypcbiAgICAgICAgY29uc3QgYWN0aW9uID0gJ3B3cF9hamF4X2hhbmRsZV9kZXZpY2VfaWQnO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIHBsdWdpblsnQWpheFVSTCddLCB0cnVlKTtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCcpO1xuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3B3cC1ub3RpZmljYXRpb24tLWxvYWRlcicpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LnNlbmQoXG4gICAgICAgICAgICBgYWN0aW9uPSR7YWN0aW9ufSZ1c2VyX2lkPSR7c3Vic2NyaXB0aW9uX2lkfSZoYW5kbGU9JHtoYW5kbGV9JiR7Y2xpZW50RGF0YXMuam9pbihcbiAgICAgICAgICAgICAgICAnJicpfWApO1xuXG4gICAgICAgICAgICovXG4gICAgfVxuXG4gICAgaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IgJiYgJ1B1c2hNYW5hZ2VyJyBpbiB3aW5kb3cpIHtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2hvdyB0b2dnbGVyIChoaWRkZW4gYnkgZGVmYXVsdClcbiAgICAgICAgICovXG5cbiAgICAgICAgJGJvZHkuY2xhc3NMaXN0LmFkZCgncHdwLW5vdGlmaWNhdGlvbicpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZGQgdHJpZ2dlclxuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCAkdG9nZ2xlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwd3Atbm90aWZpY2F0aW9uLWJ1dHRvbicpO1xuICAgICAgICBpZiAoJHRvZ2dsZXIpIHtcbiAgICAgICAgICAkdG9nZ2xlci5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICAgIGRlcmVnaXN0ZXIoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlZ2lzdGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjaGVjayBpZiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRcbiAgICAgICAgICovXG5cbiAgICAgICAgcmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyLmdldFN1YnNjcmlwdGlvbigpLnRoZW4oKHN1YnNjcmlwdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdTVUJTQ1JJUFRJT04nLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGFkZFN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgY2hhbmdlUHVzaFN0YXR1cyh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LnB3cFJlZ2lzdGVyUHVzaERldmljZSA9IHJlZ2lzdGVyUHVzaERldmljZTtcbiAgICB3aW5kb3cucHdwRGVyZWdpc3RlclB1c2hEZXZpY2UgPSBkZXJlZ2lzdGVyUHVzaERldmljZTtcbiAgfSBjYXRjaCAoZSkge31cbn0pKFB3cEpzVmFycywgV2ViUHVzaFZhcnMpO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQWdIQTs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFHQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFMQTtBQVdBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7OztBQWNBO0FBQ0E7QUE5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUFBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBREE7QUFLQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFWQTtBQWlCQTtBQUVBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBRkE7QUFMQTtBQVVBO0FBQUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBcENBO0FBQ0E7QUFxQ0E7QUFBQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFMQTtBQVVBO0FBQUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBbkJBO0FBQ0E7QUFxRUE7QUFDQTtBQUNBOzs7QUFJQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7OztBQUlBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/push.js\n");

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