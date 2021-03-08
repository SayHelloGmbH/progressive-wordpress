<?php

namespace nicomartin\ProgressiveWordPress;

class Helpers
{
    public static $authAdmin = 'administrator';

    public static function checkAuth()
    {
        return current_user_can(self::$authAdmin);
    }

    public static function getPages()
    {
        $pages = [];
        foreach (get_pages() as $post) {
            $pages[$post->ID] = get_the_title($post);
        }

        return $pages;
    }

    /**
     * @param $attach_id
     * @param $width
     * @param $height
     * @param bool $crop
     * @param bool|string $ext
     *
     * @return false|array Returns an array (url, width, height, is_intermediate), or false, if no image is available.
     */

    public static function imageResize($attach_id, $width, $height, $crop = false, $ext = false)
    {

        /**
         * wrong attachment id
         */

        if ('attachment' != get_post_type($attach_id)) {
            return false;
        }

        $width  = intval($width);
        $height = intval($height);

        $src_img       = wp_get_attachment_image_src($attach_id, 'full');
        $src_img_ratio = $src_img[1] / $src_img[2];
        $src_img_path  = get_attached_file($attach_id);

        /**
         * error: somehow file does not exist ¯\_(ツ)_/¯
         */

        if ( ! file_exists($src_img_path)) {
            return false;
        }

        $src_img_info = pathinfo($src_img_path);

        if ($crop) {
            $new_width  = $width;
            $new_height = $height;
        } elseif ($width / $height <= $src_img_ratio) {
            $new_width  = $width;
            $new_height = 1 / $src_img_ratio * $width;
        } else {
            $new_width  = $height * $src_img_ratio;
            $new_height = $height;
        }

        $new_width  = round($new_width);
        $new_height = round($new_height);

        $change_filetype = false;
        if ($ext && strtolower($src_img_info['extension']) != strtolower($ext)) {
            $change_filetype = true;
        }

        /**
         * return the source image if the requested is bigger than the original image
         */

        if (($new_width > $src_img[1] || $new_height > $src_img[2]) && ! $change_filetype) {
            return $src_img;
        }

        $extension = $src_img_info['extension'];
        if ($change_filetype) {
            $extension = $ext;
        }

        $new_img_path = "{$src_img_info['dirname']}/{$src_img_info['filename']}-{$new_width}x{$new_height}.{$extension}";
        $new_img_url  = str_replace(trailingslashit(ABSPATH), trailingslashit(get_site_url()), $new_img_path);

        /**
         * return if already exists
         */

        if (file_exists($new_img_path)) {
            return [
                $new_img_url,
                $new_width,
                $new_height,
            ];
        }

        /**
         * crop, save and return image
         */

        $image = wp_get_image_editor($src_img_path);
        if ( ! is_wp_error($image)) {
            $image->resize($width, $height, $crop);
            $image->save($new_img_path);

            return [
                $new_img_url,
                $new_width,
                $new_height,
            ];
        }

        return false;
    }
}
