(function ($, plugin) {
	$(function () {
		const $delete = $('#pwpDeleteDevice');

		$delete.on('click', function () {

			const $e = $(this);
			const $container = $e.parents('.pwp-devicestable__container');
			const subscription_id = $e.attr('data-deviceid');
			const action = 'pwp_ajax_handle_device_id';

			$container.addClass('pwp-devicestable__container--loading');

			$.ajax({
				url: plugin['AjaxURL'],
				type: 'POST',
				dataType: 'json',
				data: {
					action: action,
					user_id: subscription_id,
					handle: 'remove',
					clientData: {},
				}
			}).done(function (data) {
				$e.parents('tr').remove();
			}).fail(function () {
				console.log('remove failed');
			}).always(function () {
				$container.removeClass('pwp-devicestable__container--loading');
			});
		});
	});
})(jQuery, PwpJsVars);