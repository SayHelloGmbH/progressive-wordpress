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
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/src/ui/installprompt.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/ui/installprompt.ts":
/*!****************************************!*\
  !*** ./assets/src/ui/installprompt.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar constants_1 = __webpack_require__(/*! ./utils/constants */ \"./assets/src/ui/utils/constants.ts\");\r\nvar ACTIVE_CLASS = 'installable-active';\r\nif (constants_1.VARS.installpromptMode !== 'normal') {\r\n    var installPromptEvent_1;\r\n    window.addEventListener('beforeinstallprompt', function (event) {\r\n        // Prevent Chrome <= 67 from automatically showing the prompt\r\n        event.preventDefault();\r\n        installPromptEvent_1 = event;\r\n        if (constants_1.VARS.installpromptMode === 'trigger') {\r\n            /**\r\n             * Installable on click\r\n             */\r\n            var elements_1 = Array.from(document.querySelectorAll(constants_1.VARS.installpromptElement));\r\n            console.log('beforeinstallprompt', constants_1.VARS.installpromptMode, constants_1.VARS.installpromptElement, elements_1);\r\n            elements_1.map(function (element) {\r\n                element.classList.add(ACTIVE_CLASS);\r\n                element.onclick = function () {\r\n                    if (element.classList.contains(ACTIVE_CLASS)) {\r\n                        installPromptEvent_1.prompt();\r\n                    }\r\n                };\r\n            });\r\n            installPromptEvent_1.userChoice.then(function (choice) {\r\n                if (choice.outcome === 'accepted') {\r\n                    // User accepted the A2HS prompt\r\n                }\r\n                else {\r\n                    // User dismissed the A2HS prompt\r\n                }\r\n                elements_1.map(function (element) { return element.classList.remove(ACTIVE_CLASS); });\r\n                installPromptEvent_1 = null;\r\n            });\r\n        }\r\n    });\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpL2luc3RhbGxwcm9tcHQudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3JjL3VpL2luc3RhbGxwcm9tcHQudHM/NDEwYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVzIGZyb20gJy4vaW5zdGFsbHByb21wdC9zdHlsZXMuY3NzJztcbmltcG9ydCB7IFZBUlMgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdpbnN0YWxsYWJsZS1hY3RpdmUnO1xuXG5pZiAoVkFSUy5pbnN0YWxscHJvbXB0TW9kZSAhPT0gJ25vcm1hbCcpIHtcbiAgbGV0IGluc3RhbGxQcm9tcHRFdmVudDtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZWluc3RhbGxwcm9tcHQnLCAoZXZlbnQpID0+IHtcbiAgICAvLyBQcmV2ZW50IENocm9tZSA8PSA2NyBmcm9tIGF1dG9tYXRpY2FsbHkgc2hvd2luZyB0aGUgcHJvbXB0XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpbnN0YWxsUHJvbXB0RXZlbnQgPSBldmVudDtcblxuICAgIGlmIChWQVJTLmluc3RhbGxwcm9tcHRNb2RlID09PSAndHJpZ2dlcicpIHtcbiAgICAgIC8qKlxuICAgICAgICogSW5zdGFsbGFibGUgb24gY2xpY2tcbiAgICAgICAqL1xuXG4gICAgICBjb25zdCBlbGVtZW50cyA9IEFycmF5LmZyb20oXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoVkFSUy5pbnN0YWxscHJvbXB0RWxlbWVudClcbiAgICAgICk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnYmVmb3JlaW5zdGFsbHByb21wdCcsXG4gICAgICAgIFZBUlMuaW5zdGFsbHByb21wdE1vZGUsXG4gICAgICAgIFZBUlMuaW5zdGFsbHByb21wdEVsZW1lbnQsXG4gICAgICAgIGVsZW1lbnRzXG4gICAgICApO1xuXG4gICAgICBlbGVtZW50cy5tYXAoKGVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUyk7XG4gICAgICAgIChlbGVtZW50IGFzIEhUTUxFbGVtZW50KS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpKSB7XG4gICAgICAgICAgICBpbnN0YWxsUHJvbXB0RXZlbnQucHJvbXB0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIGluc3RhbGxQcm9tcHRFdmVudC51c2VyQ2hvaWNlLnRoZW4oKGNob2ljZSkgPT4ge1xuICAgICAgICBpZiAoY2hvaWNlLm91dGNvbWUgPT09ICdhY2NlcHRlZCcpIHtcbiAgICAgICAgICAvLyBVc2VyIGFjY2VwdGVkIHRoZSBBMkhTIHByb21wdFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFVzZXIgZGlzbWlzc2VkIHRoZSBBMkhTIHByb21wdFxuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKEFDVElWRV9DTEFTUykpO1xuICAgICAgICBpbnN0YWxsUHJvbXB0RXZlbnQgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFFQTtBQUVBO0FBSUE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui/installprompt.ts\n");

/***/ }),

/***/ "./assets/src/ui/utils/constants.ts":
/*!******************************************!*\
  !*** ./assets/src/ui/utils/constants.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.VARS = void 0;\r\nexports.VARS = window.pwpUiJsVars;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpL3V0aWxzL2NvbnN0YW50cy50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWkvdXRpbHMvY29uc3RhbnRzLnRzP2VhNzYiXSwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBwd3BVaUpzVmFyczoge1xuICAgICAgYWpheFVybDogc3RyaW5nO1xuICAgICAgaG9tZVVybDogc3RyaW5nO1xuICAgICAgZ2VuZXJhbEVycm9yOiBzdHJpbmc7XG4gICAgICByZXN0QmFzZTogc3RyaW5nO1xuICAgICAgcmVzdFBsdWdpbkJhc2U6IHN0cmluZztcbiAgICAgIHJlc3RQbHVnaW5OYW1lc3BhY2U6IHN0cmluZztcbiAgICAgIHZhcGlkUHVibGNLZXk6IG51bGwgfCBzdHJpbmc7XG4gICAgICBpbnN0YWxscHJvbXB0TW9kZTogJ25vcm1hbCcgfCAndHJpZ2dlcicgfCAnbm9uZSc7XG4gICAgICBpbnN0YWxscHJvbXB0RWxlbWVudDogbnVsbCB8IHN0cmluZztcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBWQVJTID0gd2luZG93LnB3cFVpSnNWYXJzO1xuIl0sIm1hcHBpbmdzIjoiOzs7QUFnQkE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui/utils/constants.ts\n");

/***/ })

/******/ });