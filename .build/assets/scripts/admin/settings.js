(function ($, theme, wp) {
	$(function () {

		const $container = $('.pwp-wrap');
		const $fileuploader = $container.find('.settings--fileuploader');
		const $colorpicker = $container.find('.settings--colorpicker');

		$fileuploader.each(function () {

			const $e = $(this);
			const $input = $e.find('input[type=hidden]');
			const $upload = $e.find('.select-file');
			const $delete = $e.find('.delete-file');
			const $preview = $e.find('.fileuploader__preview');

			const checkMime = $e.attr('data-mimes');
			const checkMaxWidth = $e.attr('data-max-width');
			const checkMinWidth = $e.attr('data-min-width');
			const checkMaxHeight = $e.attr('data-max-height');
			const checkMinHeight = $e.attr('data-min-height');

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
					multiple: false,
					filters: {
						type: 'jpg'
					}
				});

				frame.on('select', function () {

					const attachment = frame.state().get('selection').first().toJSON();
					let errors = [];

					if (checkMime !== '') {
						const mimesArray = checkMime.split(', ');
						const fileMime = attachment.subtype;
						if ($.inArray(fileMime, mimesArray) === -1) {
							errors.push("This file should be one of the following file types:\n" + checkMime);
						}
					}

					if (checkMaxHeight !== '' && attachment.height > checkMaxHeight) {
						errors.push(`Image can't be higher than ${checkMaxHeight}px.`);
					}

					if (checkMinHeight !== '' && attachment.height < checkMinHeight) {
						errors.push(`Image should be at least ${checkMinHeight}px high.`);
					}

					if (checkMaxWidth !== '' && attachment.width > checkMaxWidth) {
						errors.push(`Image can't be wider than ${checkMaxWidth}px.`);
					}

					if (checkMinWidth !== '' && attachment.width < checkMinWidth) {
						errors.push(`Image should be at least ${checkMinHeight}px wide.`);
					}

					if (errors.length) {
						alert(errors.join("\n\n"));
						return;
					}

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

		$colorpicker.wpColorPicker();
	});
})(jQuery, PwpJsVars, wp);