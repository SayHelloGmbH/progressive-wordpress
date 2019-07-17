<?php

namespace nicomartin\ProgressiveWordPress;

class Plugin {

	private static $instance;

	public $name = '';
	public $prefix = '';
	public $version = '';
	public $debug = '';
	public $file = '';

	public $upload_dir = '';
	public $upload_url = '';

	public $option_key = 'pwp_data';

	/**
	 * Creates an instance if one isn't already available,
	 * then return the current instance.
	 *
	 * @param  string $file The file from which the class is being instantiated.
	 *
	 * @return object       The class instance.
	 */
	public static function get_instance( $file ) {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Plugin ) ) {

			self::$instance = new Plugin;

			if ( get_option( pwp_get_instance()->option_key ) ) {
				$data = get_option( pwp_get_instance()->option_key );
			} elseif ( function_exists( 'get_plugin_data' ) ) {
				$data = get_plugin_data( $file );
			} else {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
				$data = get_plugin_data( $file );
			}

			self::$instance->name    = $data['Name'];
			self::$instance->version = $data['Version'];

			self::$instance->prefix = 'pwp';
			self::$instance->debug  = true;
			self::$instance->file   = $file;

			self::$instance->upload_dir = wp_upload_dir()['basedir'] . '/progressive-wp/';
			self::$instance->upload_url = wp_upload_dir()['baseurl'] . '/progressive-wp/';

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
	public function dump( $var, $die = false ) {
		echo '<pre>' . print_r( $var, 1 ) . '</pre>';
		if ( $die ) {
			die();
		}
	}

	/**
	 * Execution function which is called after the class has been initialized.
	 * This contains hook and filter assignments, etc.
	 */
	private function run() {
		add_action( 'plugins_loaded', [ $this, 'load_plugin_textdomain' ] );
		add_action( 'admin_init', [ $this, 'update_plugin_data' ] );
		register_deactivation_hook( pwp_get_instance()->file, [ $this, 'deactivate' ] );
		register_activation_hook( pwp_get_instance()->file, [ $this, 'activate' ] );

		if ( ! is_dir( pwp_get_instance()->upload_dir ) ) {
			mkdir( pwp_get_instance()->upload_dir );
		}
	}

	/**
	 * Load translation files from the indicated directory.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain( 'pwp', false, dirname( plugin_basename( pwp_get_instance()->file ) ) . '/languages' );
	}

	/**
	 * Update Plugin Data
	 */
	public function update_plugin_data() {

		$db_data   = get_option( pwp_get_instance()->option_key );
		$file_data = get_plugin_data( pwp_get_instance()->file );

		if ( ! $db_data || version_compare( $file_data['Version'], $db_data['Version'], '>' ) ) {

			pwp_get_instance()->name    = $file_data['Name'];
			pwp_get_instance()->version = $file_data['Version'];

			update_option( pwp_get_instance()->option_key, $file_data );

			if ( ! $db_data ) {
				do_action( 'pwp_on_first_activate' );
			} else {
				do_action( 'pwp_on_update', $db_data['Version'], $file_data['Version'] );
			}
		}
	}

	public function activate() {
		do_action( 'pwp_on_activate' );
	}

	public function deactivate() {
		do_action( 'pwp_on_deactivate' );
		delete_option( pwp_get_instance()->option_key );
	}

	/**
	 * Helpers
	 */

	/**
	 * @param $attach_id
	 * @param $width
	 * @param $height
	 * @param bool $crop
	 * @param bool|string $ext
	 *
	 * @return false|array Returns an array (url, width, height, is_intermediate), or false, if no image is available.
	 */

	public function image_resize( $attach_id, $width, $height, $crop = false, $ext = false ) {

		/**
		 * wrong attachment id
		 */

		if ( 'attachment' != get_post_type( $attach_id ) ) {
			return false;
		}

		$width  = intval( $width );
		$height = intval( $height );

		$src_img       = wp_get_attachment_image_src( $attach_id, 'full' );
		$src_img_ratio = $src_img[1] / $src_img[2];
		$src_img_path  = get_attached_file( $attach_id );

		/**
		 * error: somehow file does not exist ¯\_(ツ)_/¯
		 */

		if ( ! file_exists( $src_img_path ) ) {
			return false;
		}

		$src_img_info = pathinfo( $src_img_path );

		if ( $crop ) {
			$new_width  = $width;
			$new_height = $height;
		} elseif ( $width / $height <= $src_img_ratio ) {
			$new_width  = $width;
			$new_height = 1 / $src_img_ratio * $width;
		} else {
			$new_width  = $height * $src_img_ratio;
			$new_height = $height;
		}

		$new_width  = round( $new_width );
		$new_height = round( $new_height );

		$change_filetype = false;
		if ( $ext && strtolower( $src_img_info['extension'] ) != strtolower( $ext ) ) {
			$change_filetype = true;
		}

		/**
		 * return the source image if the requested is bigger than the original image
		 */

		if ( ( $new_width > $src_img[1] || $new_height > $src_img[2] ) && ! $change_filetype ) {
			return $src_img;
		}

		$extension = $src_img_info['extension'];
		if ( $change_filetype ) {
			$extension = $ext;
		}

		$new_img_path = "{$src_img_info['dirname']}/{$src_img_info['filename']}-{$new_width}x{$new_height}.{$extension}";
		$new_img_url  = str_replace( trailingslashit( ABSPATH ), trailingslashit( get_site_url() ), $new_img_path );

		/**
		 * return if already exists
		 */

		if ( file_exists( $new_img_path ) ) {
			return [
				$new_img_url,
				$new_width,
				$new_height,
			];
		}

		/**
		 * crop, save and return image
		 */

		$image = wp_get_image_editor( $src_img_path );
		if ( ! is_wp_error( $image ) ) {
			$image->resize( $width, $height, $crop );
			$image->save( $new_img_path );

			return [
				$new_img_url,
				$new_width,
				$new_height,
			];
		}

		return false;
	}
}
