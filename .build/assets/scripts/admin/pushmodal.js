(function ($, plugin, wp) {

	$(function () {

		$('input[name=pwp-push-image]').each(function () {

			const $e = $(this);
			const $container = $e.parent().find('.pwpmodal-uploader');
			const $upload = $container.find('#uploadImage');
			const $delete = $container.find('#removeImage');
			const $preview = $container.find('.pwpmodal-uploader__image');

			let frame;

			$e.addClass('pwpmodal-input');

			$upload.on('click', function () {
				frame = wp.media({
					title: 'Select or Upload a file',
					button: {
						text: 'Select file'
					},
					multiple: false,
					filters: {
						type: 'jpg'
					}
				});

				frame.on('select', function () {

					const attachment = frame.state().get('selection').first().toJSON();

					let preview = '';

					if (attachment.type === 'image') {
						preview = `<img src='${attachment.sizes.thumbnail.url}' />`;
					} else {
						preview = `<a target="_blank" href="${attachment.url}">${attachment.title}</a> (${attachment.mime})`;
					}

					$preview.html(preview);
					$e.val(attachment.id);
				});

				frame.open();
			});

			$delete.on('click', function () {
				$e.val(0);
				$preview.html('');
			});
		});

		$('.pwp-pushmodal').each(function () {

			const $container = $(this);
			const $loader = $container.find('.loader');
			const $success = $container.find('.success');
			const $button = $container.find('#send');

			$button.on('click', function () {

				$loader.fadeIn();

				let data = {};
				data['action'] = $container.find('input[name=pwp-push-action]').val();
				$container.find('input, select').each(function () {
					data[$(this).attr('name')] = $(this).val();
				});

				$.ajax({
					url: plugin['AjaxURL'],
					type: 'POST',
					dataType: 'json',
					data: data
				}).always(function (data) {

					if (data['type'] === null || data['type'] !== 'success') {

						let msg_content = data['message'];
						if (msg_content === '' || typeof msg_content === 'undefined') {
							msg_content = plugin['GeneralError'];
						}
						alert(msg_content);

					} else {
						$success.fadeIn();
					}
					$loader.fadeOut();
				});
			});
		});
	});
})(jQuery, PwpJsVars, wp);