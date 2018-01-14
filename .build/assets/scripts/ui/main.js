import './modules/offline';

(function ($) {

	const offlineClass = 'pwp-offline';
	const Offline = window.Offline;

	Offline.on('up', () => {
		$('body').removeClass(offlineClass);
	});

	Offline.on('down', () => {
		$('body').addClass(offlineClass);
	});

})(jQuery);