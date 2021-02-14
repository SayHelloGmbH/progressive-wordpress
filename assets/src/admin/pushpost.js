(function($, plugin) {

  $(function() {
    const postTypes = PwpJsVars['post_types'];
    $.each(postTypes, function(key, val) {

      const $checkbox = $(`#pwp_pushpost_active_${key}`);
      const $auto = $(`#pwp_pushpost_auto_${key}`);
      const $autoTr = $auto.parents('tr').first();
      const $title = $(`#pwp_pushpost_title_${key}`);
      const $titleTr = $title.parents('tr').first();
      const $body = $(`#pwp_pushpost_body_${key}`);
      const $bodyTr = $body.parents('tr').first();

      if (!$checkbox.length) {
        return;
      }

      if ($checkbox.prop('checked')) {
        $autoTr.css({ 'display': 'table-row' });
        $titleTr.css({ 'display': 'table-row' });
        $bodyTr.css({ 'display': 'table-row' });
      } else {
        $autoTr.hide();
        $titleTr.hide();
        $bodyTr.hide();
      }

      $checkbox.on('change', function() {
        if ($checkbox.prop('checked')) {
          $autoTr.css({ 'display': 'table-row' });
          $titleTr.css({ 'display': 'table-row' });
          $bodyTr.css({ 'display': 'table-row' });
        } else {
          $autoTr.hide();
          $titleTr.hide();
          $bodyTr.hide();
        }
      });
    });

    const $pushpostMeta = $('.pushpost-meta-container');
    $pushpostMeta.each(function() {
      const $box = $(this);
      $(this).find('.pushpost-meta__sendagain').on('click', function() {
        if (confirm($(this).attr('data-confirmation'))) {
          $box.removeClass('pushpost-done');
        }
      });
    });
  });
})(jQuery, PwpJsVars);