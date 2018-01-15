<?php

namespace nicomartin\ProgressiveWordPress;

class Plugin
{

	private static $instance;

	public $name = '';
	public $prefix = '';
	public $version = '';
	public $file = '';

	public $option_key = 'pwp_data';

	/**
	 * Creates an instance if one isn't already available,
	 * then return the current instance.
	 *
	 * @param  string $file The file from which the class is being instantiated.
	 *
	 * @return object       The class instance.
	 */
	public static function get_instance($file)
	{

		if (! isset(self::$instance) && ! ( self::$instance instanceof Plugin )) {
			self::$instance = new Plugin;

			if (get_option(pwp_get_instance()->option_key)) {
				$data = get_option(pwp_get_instance()->option_key);
			} elseif (function_exists('get_plugin_data')) {
				$data = get_plugin_data($file);
			} else {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
				$data = get_plugin_data($file);
			}

			self::$instance->name    = $data['Name'];
			self::$instance->version = $data['Version'];

			self::$instance->prefix = 'pwp';
			self::$instance->debug  = true;
			self::$instance->file   = $file;

			self::$instance->run();
		}

		return self::$instance;
	}

	/**
	 * Non-essential dump function to debug variables.
	 *
	 * @param  mixed $var The variable to be output
	 * @param  boolean $die Should the script stop immediately after outputting $var?
	 */
	public function dump($var, $die = false)
	{
		echo '<pre>' . print_r($var, 1) . '</pre>';
		if ($die) {
			die();
		}
	}

	/**
	 * Execution function which is called after the class has been initialized.
	 * This contains hook and filter assignments, etc.
	 */
	private function run()
	{
		add_action('plugins_loaded', array( $this, 'load_plugin_textdomain' ));
		add_action('admin_init', array( $this, 'update_plugin_data' ));
		register_deactivation_hook(pwp_get_instance()->file, array( $this, 'deactivate' ));
	}

	/**
	 * Load translation files from the indicated directory.
	 */
	public function load_plugin_textdomain()
	{
		load_plugin_textdomain('pwp', false, dirname(plugin_basename(pwp_get_instance()->file)) . '/languages');
	}

	/**
	 * Update Plugin Data
	 */
	public function update_plugin_data()
	{

		$db_data   = get_option(pwp_get_instance()->option_key);
		$file_data = get_plugin_data(pwp_get_instance()->file);

		if (! $db_data || version_compare($file_data['Version'], $db_data['Version'], '>')) {
			pwp_get_instance()->name    = $file_data['Name'];
			pwp_get_instance()->version = $file_data['Version'];

			update_option(pwp_get_instance()->option_key, $file_data);

			if (! $db_data) {
				do_action('pwp_on_activate');
			} else {
				do_action('pwp_on_update', $db_data['Version'], $file_data['Version']);
			}
		}
	}

	public function deactivate()
	{
		delete_option(pwp_get_instance()->option_key);
	}

	/**
	 * Helpers
	 */

	public function image_resize($attach_id, $width, $height, $crop = false)
	{

		$image_src     = wp_get_attachment_image_src($attach_id, 'full');
		$manifest_path = get_attached_file($attach_id);

		$file_info = pathinfo($manifest_path);
		$base_file = $file_info['dirname'] . '/' . $file_info['filename'] . '.' . $file_info['extension'];
		if (! file_exists($base_file)) {
			return;
		}
		$extension        = '.' . $file_info['extension'];
		$no_ext_path      = $file_info['dirname'] . '/' . $file_info['filename'];
		$cropped_img_path = $no_ext_path . '-' . $width . 'x' . $height . $extension;

		if ($image_src[1] > $width) {
			// the file is larger, check if the resized version already exists (for $crop = true but will also work for $crop = false if the sizes match)
			if (file_exists($cropped_img_path)) {
				$cropped_img_url = str_replace(basename($image_src[0]), basename($cropped_img_path), $image_src[0]);
				$vt_image        = array(
					'url'    => $cropped_img_url,
					'width'  => $width,
					'height' => $height,
				);

				return $vt_image;
			}
			if ($crop == false or ! $height) {
				$proportional_size = wp_constrain_dimensions($image_src[1], $image_src[2], $width, $height);
				$resized_img_path  = $no_ext_path . '-' . $proportional_size[0] . 'x' . $proportional_size[1] . $extension;

				if (file_exists($resized_img_path)) {
					$resized_img_url = str_replace(basename($image_src[0]), basename($resized_img_path), $image_src[0]);
					$vt_image        = array(
						'url'    => $resized_img_url,
						'width'  => $proportional_size[0],
						'height' => $proportional_size[1],
					);

					return $vt_image;
				}
			}

			$img_size = getimagesize($manifest_path);
			if ($img_size[0] <= $width) {
				$width = $img_size[0];
			}

			if (! function_exists('imagecreatetruecolor')) {
				echo 'GD Library Error: imagecreatetruecolor does not exist - please contact your webhost and ask them to install the GD library';

				return;
			}

			@$new_img_path = image_resize($manifest_path, $width, $height, $crop);
			$new_img_size = getimagesize($new_img_path);
			$new_img      = str_replace(basename($image_src[0]), basename($new_img_path), $image_src[0]);

			$vt_image = array(
				'url'    => $new_img,
				'width'  => $new_img_size[0],
				'height' => $new_img_size[1],
			);

			return $vt_image;
		} // End if().
		$vt_image = array(
			'url'    => $image_src[0],
			'width'  => $width,
			'height' => $height,
		);

		return $vt_image;
	}
}
