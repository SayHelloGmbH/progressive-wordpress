(function (plugin) {

	const $body = document.getElementsByTagName('body')[0];
	const offlineClass = 'pwp-offline';

	function updateOnlineStatus() {
		if (navigator.onLine) {
			$body.classList.remove(offlineClass);
		} else {
			$body.classList.add(offlineClass);
		}
	}

	updateOnlineStatus();
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);

})(PwpJsVars);