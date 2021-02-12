<?php

namespace nicomartin\ProgressiveWordPress;

class Helpers
{
	public static function checkAuth()
	{
		return current_user_can('administrator');
	}

	public static function pwpGetPages()
	{
		$pages = [];

		foreach (get_pages() as $page) {
			$pages[get_permalink($page)] = get_the_title($page);
		}

		if ( ! array_key_exists(get_site_url(), $pages)) {
			$pages = array_merge([get_site_url() => 'Front Page'], $pages);
		}

		return $pages;
	}
}
