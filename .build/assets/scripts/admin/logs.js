(function ($, plugin) {
	$(function () {
		const $button = $('.pwp-download-log');

		$button.on('click', function () {

			const $e = $(this);
			const logtype = $e.attr('data-log');

			if (typeof logtype === 'undefined') {
				return;
			}

			$e.prop('disabled', true);

			$.ajax({
				url: plugin['AjaxURL'],
				type: 'POST',
				dataType: 'json',
				data: {
					action: 'pwp_ajax_download_log',
					logtype: logtype
				}
			}).always(function (data) {

				if (data['type'] === null || data['type'] !== 'success') {

					let msg_content = data['message'];
					if (msg_content === '' || msg_content === undefined) {
						msg_content = 'error';
					}

					alert(msg_content);
				} else {
					console.log(data['message']);

				}
				$e.removeAttr('disabled');
			});
		});
	});
})(jQuery, PwpJsVars);