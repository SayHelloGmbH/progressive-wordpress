//import './modules/offline';

(function ($, theme) {

	const $body = $('body');
	const offlineClass = 'pwp-offline';

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

})(jQuery, ThemeJSVars);