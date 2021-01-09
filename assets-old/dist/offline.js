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
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/src/ui-offline/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/ui-offline/index.js":
/*!****************************************!*\
  !*** ./assets/src/ui-offline/index.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _offline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./offline */ \"./assets/src/ui-offline/offline.js\");\n/* harmony import */ var _offline__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_offline__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ui_offline_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-offline.scss */ \"./assets/src/ui-offline/ui-offline.scss\");\n/* harmony import */ var _ui_offline_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_offline_scss__WEBPACK_IMPORTED_MODULE_1__);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLW9mZmxpbmUvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvc3JjL3VpLW9mZmxpbmUvaW5kZXguanM/YTAwZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vb2ZmbGluZSc7XG5pbXBvcnQgJy4vdWktb2ZmbGluZS5zY3NzJztcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./assets/src/ui-offline/index.js\n");

/***/ }),

/***/ "./assets/src/ui-offline/offline.js":
/*!******************************************!*\
  !*** ./assets/src/ui-offline/offline.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function (plugin) {\n  var $body = document.getElementsByTagName('body')[0];\n  var offlineClass = 'pwp-offline';\n\n  function updateOnlineStatus() {\n    if (navigator.onLine) {\n      $body.classList.remove(offlineClass);\n    } else {\n      $body.classList.add(offlineClass);\n    }\n  }\n\n  updateOnlineStatus();\n  window.addEventListener('online', updateOnlineStatus);\n  window.addEventListener('offline', updateOnlineStatus);\n})(PwpJsVars);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLW9mZmxpbmUvb2ZmbGluZS5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2Fzc2V0cy9zcmMvdWktb2ZmbGluZS9vZmZsaW5lLmpzP2QwMDMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIChwbHVnaW4pIHtcblxuXHRjb25zdCAkYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07XG5cdGNvbnN0IG9mZmxpbmVDbGFzcyA9ICdwd3Atb2ZmbGluZSc7XG5cblx0ZnVuY3Rpb24gdXBkYXRlT25saW5lU3RhdHVzKCkge1xuXHRcdGlmIChuYXZpZ2F0b3Iub25MaW5lKSB7XG5cdFx0XHQkYm9keS5jbGFzc0xpc3QucmVtb3ZlKG9mZmxpbmVDbGFzcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCRib2R5LmNsYXNzTGlzdC5hZGQob2ZmbGluZUNsYXNzKTtcblx0XHR9XG5cdH1cblxuXHR1cGRhdGVPbmxpbmVTdGF0dXMoKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsIHVwZGF0ZU9ubGluZVN0YXR1cyk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgdXBkYXRlT25saW5lU3RhdHVzKTtcblxufSkoUHdwSnNWYXJzKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./assets/src/ui-offline/offline.js\n");

/***/ }),

/***/ "./assets/src/ui-offline/ui-offline.scss":
/*!***********************************************!*\
  !*** ./assets/src/ui-offline/ui-offline.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hc3NldHMvc3JjL3VpLW9mZmxpbmUvdWktb2ZmbGluZS5zY3NzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXNzZXRzL3NyYy91aS1vZmZsaW5lL3VpLW9mZmxpbmUuc2Nzcz82ZWY2Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJtYXBwaW5ncyI6IkFBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./assets/src/ui-offline/ui-offline.scss\n");

/***/ })

/******/ });