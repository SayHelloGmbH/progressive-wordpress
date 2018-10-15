(function ($, plugin) {

	$(function () {

		let installPromptEvent;

		if (plugin.installprompt.mode === 'normal') {
			return;
		}

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
						installPromptEvent.userChoice.then((choice) => {
							if (choice.outcome === 'accepted') {
								// User accepted the A2HS prompt
							} else {
								// User dismissed the A2HS prompt
							}

							$(plugin.installprompt.onclick).removeClass('installable-active');
							installPromptEvent = null;
						});
					}
				});
			} else {
				installPromptEvent.prompt();
			}
		});
	});
})(jQuery, PwpJsVars);