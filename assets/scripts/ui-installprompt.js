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

	var installPromptEvent = void 0;

	if (plugin.installprompt.mode === 'normal') {
		return;
	}

	window.addEventListener('beforeinstallprompt', function (event) {

		// Prevent Chrome <= 67 from automatically showing the prompt
		event.preventDefault();
		installPromptEvent = event;

		if (plugin.installprompt.mode === 'trigger') {
			(function () {

				/**
     * Installable on click
     */

				var $elements = document.querySelectorAll(plugin.installprompt.onclick);
				var i = void 0,
				    ii = void 0;

				for (i = 0; i < $elements.length; ++i) {
					$elements[i].classList.add('installable-active');
					$elements[i].onclick = function () {
						if (this.classList.contains('installable-active')) {
							installPromptEvent.prompt();
							installPromptEvent.userChoice.then(function (choice) {
								if (choice.outcome === 'accepted') {
									// User accepted the A2HS prompt
								} else {
										// User dismissed the A2HS prompt
									}

								for (ii = 0; ii < $elements.length; ++ii) {
									$elements[ii].classList.remove('installable-active');
								}

								installPromptEvent = null;
							});
						}
					};
				}
			})();
		} else {
			installPromptEvent.prompt();
		}
	});
})(PwpJsVars);

/***/ })
/******/ ]);