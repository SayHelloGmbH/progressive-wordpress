<?php

namespace nicomartin\ProgressiveWordPress;

class Assets
{
  public function run()
  {
    add_action('wp_enqueue_scripts', [$this, 'add_assets']);
    add_action('admin_enqueue_scripts', [$this, 'add_admin_assets']);
  }

  public function add_assets()
  {
    $script_version = pwp_get_instance()->version;
    $dir_uri        = trailingslashit(plugin_dir_url(pwp_get_instance()->file));

    wp_enqueue_style(pwp_get_instance()->prefix . '-ui-style', $dir_uri . 'assets/dist/ui.css', [],
      $script_version);
    wp_enqueue_script(pwp_get_instance()->prefix . '-ui-script', $dir_uri . 'assets/dist/ui.js', [],
      $script_version, true);
  }

  public function add_admin_assets()
  {
    $script_version = pwp_get_instance()->version;
    $dir_uri        = trailingslashit(plugin_dir_url(pwp_get_instance()->file));

    wp_enqueue_media();
    wp_enqueue_script('react', $dir_uri . 'assets/react.production.min.js', [], '17', true);
    wp_enqueue_script('react-dom', $dir_uri . 'assets/react-dom.production.min.js', [], '17', true);

    wp_enqueue_style(pwp_get_instance()->prefix . '-admin-style', $dir_uri . 'assets/dist/admin.css', [],
      $script_version);
    wp_enqueue_script(pwp_get_instance()->prefix . '-admin-script', $dir_uri . 'assets/dist/admin.js', [
      'react',
      'react-dom',
    ], $script_version, true);

    /**
     * Admin Footer JS
     */

    $defaults = [
      'ajaxUrl'            => admin_url('admin-ajax.php'),
      'homeUrl'            => trailingslashit(get_site_url()),
      'generalError'       => __('An unexpected error occured', 'plugin-boilerplate'),
      'settings'           => pwp_get_instance()->settings->get_settings(),
      'restBase'           => trailingslashit(get_rest_url()),
      'restPluginBase'     => trailingslashit(get_rest_url() . pwp_get_instance()->api_namespace),
      'translationStrings' => apply_filters('pwp_translation_strings', []),
    ];

    $vars = json_encode(apply_filters('pwp_admin_footer_js', $defaults));

    wp_add_inline_script(pwp_get_instance()->prefix . '-admin-script', "var pwpJsVars = {$vars};", 'before');
  }
}
