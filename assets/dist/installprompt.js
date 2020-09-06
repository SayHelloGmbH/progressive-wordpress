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
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/src/ui-installprompt/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/ui-installprompt/index.js":
/*!**********************************************!*\
  !*** ./assets/src/ui-installprompt/index.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _installprompt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./installprompt */ \"./assets/src/ui-installprompt/installprompt.js\");\n/* harmony import */ var _installprompt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_installprompt__WEBPACK_IMPORTED_MODULE_0__);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLWluc3RhbGxwcm9tcHQvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3JjL3VpLWluc3RhbGxwcm9tcHQvaW5kZXguanM/OTY2ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vaW5zdGFsbHByb21wdCc7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./assets/src/ui-installprompt/index.js\n");

/***/ }),

/***/ "./assets/src/ui-installprompt/installprompt.js":
/*!******************************************************!*\
  !*** ./assets/src/ui-installprompt/installprompt.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function (plugin) {\n  var installPromptEvent;\n\n  if (plugin.installprompt.mode === 'normal') {\n    return;\n  }\n\n  window.addEventListener('beforeinstallprompt', function (event) {\n    // Prevent Chrome <= 67 from automatically showing the prompt\n    event.preventDefault();\n    installPromptEvent = event;\n\n    if (plugin.installprompt.mode === 'trigger') {\n      (function () {\n        /**\n         * Installable on click\n         */\n        var $elements = document.querySelectorAll(plugin.installprompt.onclick);\n        var i, ii;\n\n        for (i = 0; i < $elements.length; ++i) {\n          $elements[i].classList.add('installable-active');\n\n          $elements[i].onclick = function () {\n            if (this.classList.contains('installable-active')) {\n              installPromptEvent.prompt();\n              installPromptEvent.userChoice.then(function (choice) {\n                if (choice.outcome === 'accepted') {// User accepted the A2HS prompt\n                } else {// User dismissed the A2HS prompt\n                  }\n\n                for (ii = 0; ii < $elements.length; ++ii) {\n                  $elements[ii].classList.remove('installable-active');\n                }\n\n                installPromptEvent = null;\n              });\n            }\n          };\n        }\n      })();\n    } else {\n      installPromptEvent.prompt();\n    }\n  });\n})(PwpJsVars);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLWluc3RhbGxwcm9tcHQvaW5zdGFsbHByb21wdC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktaW5zdGFsbHByb21wdC9pbnN0YWxscHJvbXB0LmpzP2JjYmIiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgbGV0IGluc3RhbGxQcm9tcHRFdmVudDtcblxuICBpZiAocGx1Z2luLmluc3RhbGxwcm9tcHQubW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JlaW5zdGFsbHByb21wdCcsIChldmVudCkgPT4ge1xuICAgIC8vIFByZXZlbnQgQ2hyb21lIDw9IDY3IGZyb20gYXV0b21hdGljYWxseSBzaG93aW5nIHRoZSBwcm9tcHRcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGluc3RhbGxQcm9tcHRFdmVudCA9IGV2ZW50O1xuXG4gICAgaWYgKHBsdWdpbi5pbnN0YWxscHJvbXB0Lm1vZGUgPT09ICd0cmlnZ2VyJykge1xuICAgICAgLyoqXG4gICAgICAgKiBJbnN0YWxsYWJsZSBvbiBjbGlja1xuICAgICAgICovXG5cbiAgICAgIGNvbnN0ICRlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGx1Z2luLmluc3RhbGxwcm9tcHQub25jbGljayk7XG4gICAgICBsZXQgaSwgaWk7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCAkZWxlbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgJGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoJ2luc3RhbGxhYmxlLWFjdGl2ZScpO1xuICAgICAgICAkZWxlbWVudHNbaV0ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2luc3RhbGxhYmxlLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICBpbnN0YWxsUHJvbXB0RXZlbnQucHJvbXB0KCk7XG4gICAgICAgICAgICBpbnN0YWxsUHJvbXB0RXZlbnQudXNlckNob2ljZS50aGVuKChjaG9pY2UpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGNob2ljZS5vdXRjb21lID09PSAnYWNjZXB0ZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlciBhY2NlcHRlZCB0aGUgQTJIUyBwcm9tcHRcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBVc2VyIGRpc21pc3NlZCB0aGUgQTJIUyBwcm9tcHRcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGZvciAoaWkgPSAwOyBpaSA8ICRlbGVtZW50cy5sZW5ndGg7ICsraWkpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudHNbaWldLmNsYXNzTGlzdC5yZW1vdmUoJ2luc3RhbGxhYmxlLWFjdGl2ZScpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaW5zdGFsbFByb21wdEV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFsbFByb21wdEV2ZW50LnByb21wdCgpO1xuICAgIH1cbiAgfSk7XG59KShQd3BKc1ZhcnMpO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1QkE7QUE2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./assets/src/ui-installprompt/installprompt.js\n");

/***/ })

/******/ });