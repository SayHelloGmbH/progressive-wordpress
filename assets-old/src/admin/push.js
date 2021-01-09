(function ($, plugin) {
  $(function () {
    const $delete = $('#pwpDeleteDevice');

    $delete.on('click', function () {
      const $e = $(this);
      const $container = $e.parents('.pwp-devicestable__container');
      const endpoint = $e.attr('data-endpoint');
      const action = 'pwp_ajax_remove_webpush_subscription';

      $container.addClass('pwp-devicestable__container--loading');

      fetch(`${plugin['AjaxURL']}?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
        }),
      })
        .then((response) => response.json())
        .then((data) => $e.parents('tr').remove())
        .catch((e) => {
          console.log(e);
        })
        .finally(() =>
          $container.removeClass('pwp-devicestable__container--loading')
        );
    });
  });
})(jQuery, PwpJsVars);
