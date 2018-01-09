(function ($, theme, wp) {
	$(function () {

		const $container = $('.pwp-wrap');
		const $fileuploader = $container.find('.settings--fileuploader');

		$fileuploader.each(function () {

			const $e = $(this);
			const $input = $e.find('input[type=hidden]');
			const $upload = $e.find('.select-file');
			const $delete = $e.find('.delete-file');
			const $preview = $e.find('.fileuploader__preview');
			let frame;

			$delete.on('click', function () {
				$e.attr('data-fileid', 0);
				$preview.html('');
				$input.val(0);
			});

			$upload.on('click', function () {
				frame = wp.media({
					title: 'Select or Upload a file',
					button: {
						text: 'Select file'
					},
					multiple: false  // Set to true to allow multiple files to be selected
				});

				frame.on('select', function () {

					const attachment = frame.state().get('selection').first().toJSON();
					let preview = '';

					if (attachment.type === 'image') {
						preview = `<img src='${attachment.sizes.thumbnail.url}' />`;
					} else {
						preview = `<a target="_blank" href="${attachment.url}">${attachment.title}</a> (${attachment.mime})`;
					}

					$e.attr('data-fileid', attachment.id);
					$preview.html(preview);
					$input.val(attachment.id);
				});

				frame.open();
			});
		});
	});
})(jQuery, PwpJsVars, wp);