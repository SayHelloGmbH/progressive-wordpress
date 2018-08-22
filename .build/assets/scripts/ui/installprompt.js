(function ($, plugin) {

	$(function () {

		let installPromptEvent;

		window.addEventListener('beforeinstallprompt', (event) => {

			// Prevent Chrome <= 67 from automatically showing the prompt
			event.preventDefault();
			installPromptEvent = event;

			if (plugin.installprompt.mode === 'trigger') {

				/**
				 * Installable on click
				 */

				$(plugin.installprompt.onclick).addClass('installable-active');
				$(plugin.installprompt.onclick).on('click', function () {
					if ($(this).hasClass('installable-active')) {
						installPromptEvent.prompt();
					}
				});
			}

			installPromptEvent.userChoice.then((choice) => {
				if (choice.outcome === 'accepted') {
					// User accepted the A2HS prompt
				} else {
					// User dismissed the A2HS prompt
				}

				$(plugin.installprompt.onclick).removeClass('installable-active');
				installPromptEvent = null;
			});
		});

		/*
		const updatePageLoadCount = function () {
			const cookie = 'pwpPageloadCookie';
			const pageloads = parseInt(plugin.installprompt.pageloads);
			let cookieCount = getCookie(cookie);
			if (!cookieCount) {
				cookieCount = 0;
			}

			if (pageloads >= cookieCount) {
				installPromptEvent.prompt();
			}

			setCookie(cookie, parseInt(cookieCount) + 1, 365);
		};

		function setCookie(cname, cvalue, exdays) {
			const d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			const expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		}

		function getCookie(cname) {
			const name = cname + "=";
			const decodedCookie = decodeURIComponent(document.cookie);
			const ca = decodedCookie.split(';');
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}
			return false;
		}
		*/
	});
})(jQuery, PwpJsVars);