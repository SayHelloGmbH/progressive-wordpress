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

/***/ "./assets/src/ui-webpushbutton/index.js":
/*!**********************************************!*\
  !*** ./assets/src/ui-webpushbutton/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./push */ \"./assets/src/ui-webpushbutton/push.js\");\n/* harmony import */ var _push__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_push__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-pushbutton.scss */ \"./assets/src/ui-webpushbutton/ui-pushbutton.scss\");\n/* harmony import */ var _ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_pushbutton_scss__WEBPACK_IMPORTED_MODULE_1__);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vaW5kZXguanM/MjY3YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vcHVzaCc7XG5pbXBvcnQgJy4vdWktcHVzaGJ1dHRvbi5zY3NzJztcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/index.js\n");

/***/ }),

/***/ "./assets/src/ui-webpushbutton/push.js":
/*!*********************************************!*\
  !*** ./assets/src/ui-webpushbutton/push.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function (plugin) {\n  try {\n    var handleSubscriptionID = function handleSubscriptionID(subscription, handle) {\n      /*\n        const clientDatas = [];\n        Object.keys(clientData).forEach(function(key) {\n          Object.keys(clientData[key]).forEach(function(dataKey) {\n            clientDatas.push(\n                `clientData[${key}][${dataKey}]=${clientData[key][dataKey]}`);\n          });\n        });*/\n      console.log('POST', {\n        subscription: subscription,\n        clientData: clientData,\n        handle: handle\n      });\n      fetch(\"\".concat(plugin['AjaxURL'], \"?action=pwp_ajax_handle_webpush_subscription\"), {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          subscription: subscription,\n          clientData: clientData,\n          handle: handle\n        })\n      }).then(function (response) {\n        return response.json();\n      }).then(function (data) {\n        return console.log(data);\n      }); // todo: add subscription\n\n      /*\n      const action = 'pwp_ajax_handle_device_id';\n      const request = new XMLHttpRequest();\n      request.open('POST', plugin['AjaxURL'], true);\n      request.setRequestHeader('Content-Type',\n          'application/x-www-form-urlencoded; charset=UTF-8');\n      request.onload = function() {\n        $body.classList.remove('pwp-notification--loader');\n      };\n      request.send(\n          `action=${action}&user_id=${subscription_id}&handle=${handle}&${clientDatas.join(\n              '&')}`);\n          */\n    };\n\n    var active = false;\n    var $body = document.getElementsByTagName('body')[0];\n\n    var urlBase64ToUint8Array = function urlBase64ToUint8Array(base64String) {\n      var padding = '='.repeat((4 - base64String.length % 4) % 4);\n      var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');\n      var rawData = atob(base64);\n      var outputArray = new Uint8Array(rawData.length);\n\n      for (var i = 0; i < rawData.length; ++i) {\n        outputArray[i] = rawData.charCodeAt(i);\n      }\n\n      return outputArray;\n    };\n\n    var changePushStatus = function changePushStatus(status) {\n      active = status;\n\n      if (status) {\n        $body.classList.add('pwp-notification--on');\n      } else {\n        $body.classList.remove('pwp-notification--on');\n      }\n    };\n\n    var register = function register() {\n      console.log('register');\n      $body.classList.add('pwp-notification--loader');\n      navigator.serviceWorker.ready.then(function (registration) {\n        registration.pushManager.subscribe({\n          userVisibleOnly: true,\n          applicationServerKey: urlBase64ToUint8Array(WebPushVars.vapidPublcKey)\n        }).then(function (subscription) {\n          return addSubscription(subscription).then(function () {\n            return changePushStatus(true);\n          });\n        })[\"catch\"](function () {\n          changePushStatus(false);\n          alert(plugin['message_pushadd_failed']);\n        });\n      });\n    };\n\n    var deregister = function deregister() {\n      return;\n      $body.classList.add('pwp-notification--loader');\n      navigator.serviceWorker.ready.then(function (registration) {\n        registration.pushManager.getSubscription().then(function (subscription) {\n          if (!subscription) {\n            return;\n          }\n\n          subscription.unsubscribe().then(function () {\n            handleSubscriptionID(subscription, 'remove');\n            changePushStatus(false);\n          })[\"catch\"](function () {\n            changePushStatus(true);\n            alert(plugin['message_pushremove_failed']);\n          });\n        });\n      });\n    };\n\n    var addSubscription = function addSubscription(subscription) {\n      return new Promise(function (resolve, reject) {\n        var client = new ClientJS();\n        var clientData = {\n          browser: {\n            browser: client.getBrowser(),\n            version: client.getBrowserVersion(),\n            major: client.getBrowserMajorVersion()\n          },\n          os: {\n            os: client.getOS(),\n            version: client.getOSVersion()\n          },\n          device: {\n            device: client.getDevice(),\n            type: client.getDeviceType(),\n            vendor: client.getDeviceVendor()\n          }\n        };\n        reject(clientData);\n      });\n    };\n\n    if ('serviceWorker' in navigator && 'PushManager' in window) {\n      navigator.serviceWorker.ready.then(function (registration) {\n        /**\n         * Show toggler (hidden by default)\n         */\n        $body.classList.add('pwp-notification');\n        /**\n         * add trigger\n         */\n\n        var $toggler = document.getElementById('pwp-notification-button');\n\n        if ($toggler) {\n          $toggler.onclick = function () {\n            active = false;\n\n            if (active) {\n              deregister();\n            } else {\n              register();\n            }\n          };\n        }\n        /**\n         * check if is already registered\n         */\n\n\n        registration.pushManager.getSubscription().then(function (subscription) {\n          if (subscription) {\n            changePushStatus(true);\n          }\n        });\n      });\n    }\n\n    window.pwpRegisterPushDevice = registerPushDevice;\n    window.pwpDeregisterPushDevice = deregisterPushDevice;\n  } catch (e) {}\n})(PwpJsVars);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLXdlYnB1c2hidXR0b24vcHVzaC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktd2VicHVzaGJ1dHRvbi9wdXNoLmpzP2M2NDgiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgdHJ5IHtcbiAgICBsZXQgYWN0aXZlID0gZmFsc2U7XG4gICAgY29uc3QgJGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdO1xuXG4gICAgY29uc3QgdXJsQmFzZTY0VG9VaW50OEFycmF5ID0gKGJhc2U2NFN0cmluZykgPT4ge1xuICAgICAgY29uc3QgcGFkZGluZyA9ICc9Jy5yZXBlYXQoKDQgLSAoYmFzZTY0U3RyaW5nLmxlbmd0aCAlIDQpKSAlIDQpO1xuICAgICAgY29uc3QgYmFzZTY0ID0gKGJhc2U2NFN0cmluZyArIHBhZGRpbmcpXG4gICAgICAgIC5yZXBsYWNlKC8tL2csICcrJylcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJy8nKTtcblxuICAgICAgY29uc3QgcmF3RGF0YSA9IGF0b2IoYmFzZTY0KTtcbiAgICAgIGNvbnN0IG91dHB1dEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3RGF0YS5sZW5ndGgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhd0RhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgb3V0cHV0QXJyYXlbaV0gPSByYXdEYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0QXJyYXk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNoYW5nZVB1c2hTdGF0dXMgPSAoc3RhdHVzKSA9PiB7XG4gICAgICBhY3RpdmUgPSBzdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgICRib2R5LmNsYXNzTGlzdC5hZGQoJ3B3cC1ub3RpZmljYXRpb24tLW9uJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwd3Atbm90aWZpY2F0aW9uLS1vbicpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCByZWdpc3RlciA9ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlcicpO1xuICAgICAgJGJvZHkuY2xhc3NMaXN0LmFkZCgncHdwLW5vdGlmaWNhdGlvbi0tbG9hZGVyJyk7XG4gICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWFkeS50aGVuKChyZWdpc3RyYXRpb24pID0+IHtcbiAgICAgICAgcmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyXG4gICAgICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgICAgICB1c2VyVmlzaWJsZU9ubHk6IHRydWUsXG4gICAgICAgICAgICBhcHBsaWNhdGlvblNlcnZlcktleTogdXJsQmFzZTY0VG9VaW50OEFycmF5KFxuICAgICAgICAgICAgICBXZWJQdXNoVmFycy52YXBpZFB1YmxjS2V5XG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oKHN1YnNjcmlwdGlvbikgPT5cbiAgICAgICAgICAgIGFkZFN1YnNjcmlwdGlvbihzdWJzY3JpcHRpb24pLnRoZW4oKCkgPT4gY2hhbmdlUHVzaFN0YXR1cyh0cnVlKSlcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIGNoYW5nZVB1c2hTdGF0dXMoZmFsc2UpO1xuICAgICAgICAgICAgYWxlcnQocGx1Z2luWydtZXNzYWdlX3B1c2hhZGRfZmFpbGVkJ10pO1xuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGRlcmVnaXN0ZXIgPSAoKSA9PiB7XG4gICAgICByZXR1cm47XG4gICAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdwd3Atbm90aWZpY2F0aW9uLS1sb2FkZXInKTtcbiAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlYWR5LnRoZW4oZnVuY3Rpb24gKHJlZ2lzdHJhdGlvbikge1xuICAgICAgICByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXJcbiAgICAgICAgICAuZ2V0U3Vic2NyaXB0aW9uKClcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25cbiAgICAgICAgICAgICAgLnVuc3Vic2NyaWJlKClcbiAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGhhbmRsZVN1YnNjcmlwdGlvbklEKHN1YnNjcmlwdGlvbiwgJ3JlbW92ZScpO1xuICAgICAgICAgICAgICAgIGNoYW5nZVB1c2hTdGF0dXMoZmFsc2UpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNoYW5nZVB1c2hTdGF0dXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgYWxlcnQocGx1Z2luWydtZXNzYWdlX3B1c2hyZW1vdmVfZmFpbGVkJ10pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBhZGRTdWJzY3JpcHRpb24gPSAoc3Vic2NyaXB0aW9uKSA9PlxuICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50SlMoKTtcbiAgICAgICAgY29uc3QgY2xpZW50RGF0YSA9IHtcbiAgICAgICAgICBicm93c2VyOiB7XG4gICAgICAgICAgICBicm93c2VyOiBjbGllbnQuZ2V0QnJvd3NlcigpLFxuICAgICAgICAgICAgdmVyc2lvbjogY2xpZW50LmdldEJyb3dzZXJWZXJzaW9uKCksXG4gICAgICAgICAgICBtYWpvcjogY2xpZW50LmdldEJyb3dzZXJNYWpvclZlcnNpb24oKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9zOiB7XG4gICAgICAgICAgICBvczogY2xpZW50LmdldE9TKCksXG4gICAgICAgICAgICB2ZXJzaW9uOiBjbGllbnQuZ2V0T1NWZXJzaW9uKCksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXZpY2U6IHtcbiAgICAgICAgICAgIGRldmljZTogY2xpZW50LmdldERldmljZSgpLFxuICAgICAgICAgICAgdHlwZTogY2xpZW50LmdldERldmljZVR5cGUoKSxcbiAgICAgICAgICAgIHZlbmRvcjogY2xpZW50LmdldERldmljZVZlbmRvcigpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHJlamVjdChjbGllbnREYXRhKTtcbiAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3Vic2NyaXB0aW9uSUQoc3Vic2NyaXB0aW9uLCBoYW5kbGUpIHtcbiAgICAgIC8qXG4gICAgICAgIGNvbnN0IGNsaWVudERhdGFzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKGNsaWVudERhdGEpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoY2xpZW50RGF0YVtrZXldKS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGFLZXkpIHtcbiAgICAgICAgICAgIGNsaWVudERhdGFzLnB1c2goXG4gICAgICAgICAgICAgICAgYGNsaWVudERhdGFbJHtrZXl9XVske2RhdGFLZXl9XT0ke2NsaWVudERhdGFba2V5XVtkYXRhS2V5XX1gKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7Ki9cblxuICAgICAgY29uc29sZS5sb2coJ1BPU1QnLCB7XG4gICAgICAgIHN1YnNjcmlwdGlvbixcbiAgICAgICAgY2xpZW50RGF0YSxcbiAgICAgICAgaGFuZGxlLFxuICAgICAgfSk7XG5cbiAgICAgIGZldGNoKFxuICAgICAgICBgJHtwbHVnaW5bJ0FqYXhVUkwnXX0/YWN0aW9uPXB3cF9hamF4X2hhbmRsZV93ZWJwdXNoX3N1YnNjcmlwdGlvbmAsXG4gICAgICAgIHtcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xpZW50RGF0YSxcbiAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfVxuICAgICAgKVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oKGRhdGEpID0+IGNvbnNvbGUubG9nKGRhdGEpKTtcblxuICAgICAgLy8gdG9kbzogYWRkIHN1YnNjcmlwdGlvblxuXG4gICAgICAvKlxuICAgICAgY29uc3QgYWN0aW9uID0gJ3B3cF9hamF4X2hhbmRsZV9kZXZpY2VfaWQnO1xuICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmVxdWVzdC5vcGVuKCdQT1NUJywgcGx1Z2luWydBamF4VVJMJ10sIHRydWUpO1xuICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnKTtcbiAgICAgIHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3B3cC1ub3RpZmljYXRpb24tLWxvYWRlcicpO1xuICAgICAgfTtcbiAgICAgIHJlcXVlc3Quc2VuZChcbiAgICAgICAgICBgYWN0aW9uPSR7YWN0aW9ufSZ1c2VyX2lkPSR7c3Vic2NyaXB0aW9uX2lkfSZoYW5kbGU9JHtoYW5kbGV9JiR7Y2xpZW50RGF0YXMuam9pbihcbiAgICAgICAgICAgICAgJyYnKX1gKTtcblxuICAgICAgICAgKi9cbiAgICB9XG5cbiAgICBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvciAmJiAnUHVzaE1hbmFnZXInIGluIHdpbmRvdykge1xuICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVhZHkudGhlbihmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93IHRvZ2dsZXIgKGhpZGRlbiBieSBkZWZhdWx0KVxuICAgICAgICAgKi9cblxuICAgICAgICAkYm9keS5jbGFzc0xpc3QuYWRkKCdwd3Atbm90aWZpY2F0aW9uJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFkZCB0cmlnZ2VyXG4gICAgICAgICAqL1xuXG4gICAgICAgIGNvbnN0ICR0b2dnbGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3B3cC1ub3RpZmljYXRpb24tYnV0dG9uJyk7XG4gICAgICAgIGlmICgkdG9nZ2xlcikge1xuICAgICAgICAgICR0b2dnbGVyLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICAgICAgZGVyZWdpc3RlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVnaXN0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNoZWNrIGlmIGlzIGFscmVhZHkgcmVnaXN0ZXJlZFxuICAgICAgICAgKi9cblxuICAgICAgICByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIuZ2V0U3Vic2NyaXB0aW9uKCkudGhlbigoc3Vic2NyaXB0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgY2hhbmdlUHVzaFN0YXR1cyh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LnB3cFJlZ2lzdGVyUHVzaERldmljZSA9IHJlZ2lzdGVyUHVzaERldmljZTtcbiAgICB3aW5kb3cucHdwRGVyZWdpc3RlclB1c2hEZXZpY2UgPSBkZXJlZ2lzdGVyUHVzaERldmljZTtcbiAgfSBjYXRjaCAoZSkge31cbn0pKFB3cEpzVmFycyk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFBQTtBQWdHQTs7Ozs7Ozs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFHQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFMQTtBQVlBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFHQTs7Ozs7Ozs7Ozs7OztBQWNBO0FBQ0E7QUFoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFNQTtBQUNBO0FBQUE7QUFEQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFWQTtBQWdCQTtBQUNBO0FBcEJBO0FBQ0E7QUF3RUE7QUFDQTtBQUNBOzs7QUFJQTtBQUVBOzs7O0FBSUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./assets/src/ui-webpushbutton/push.js\n");

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