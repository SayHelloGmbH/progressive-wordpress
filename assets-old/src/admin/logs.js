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
					action: `pwp_ajax_download_log-${logtype}`,
				}
			}).always(function (data) {

				if (data['type'] === null || data['type'] !== 'success') {

					let msg_content = data['message'];
					if (msg_content === '' || msg_content === undefined) {
						msg_content = 'error';
					}

					alert(msg_content);
				} else {

					download(data['add']['url'], data['add']['file']);
				}
				$e.removeAttr('disabled');
			});
		});


		function download(dataurl, filename) {
			const $a = document.createElement("a");
			$a.href = dataurl;
			$a.setAttribute("download", filename);
			const b = document.createEvent("MouseEvents");
			b.initEvent("click", false, true);
			$a.dispatchEvent(b);
			return false;
		}
	});
})(jQuery, PwpJsVars);