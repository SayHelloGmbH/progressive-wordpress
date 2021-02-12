<?php

namespace nicomartin\ProgressiveWordPress;

class Manifest
{

	public static $key = 'pwp-settings';
	public $registered_settings = [];

	public function __construct()
	{
	}

	public function run()
	{
		add_filter('pwp_plugin_strings', [$this, 'pluginStrings']);
		add_filter('pwp_register_settings', [$this, 'settings']);
	}

	public function pluginStrings($strings)
	{
		return $strings;
	}

	public function settings($settings)
	{
		$installableModes = [
			'normal'  => __('Normal', 'progressive-wp'),
			'trigger' => __('On element click', 'progressive-wp'),
			'none'    => __('None', 'progressive-wp')
		];

		$settings['installable-mode'] = [
			'default'  => 'normal',
			'label'    => __('Show "add to homescreen" banner', 'progressive-wp'),
			'validate' => function ($value) use ($installableModes) {
				if ( ! in_array($value, array_keys($installableModes))) {
					return sprintf(__('"Mode" has to be one of those values: %s', 'progressive-wp'), join(',', $valid));
				}

				return '';
			},
			'values'   => $installableModes,
		];

		$settings['installable-onclick'] = [
			'default'  => '',
			'label'    => __('Element', 'progressive-wp'),
			'validate' => null,
		];

		$settings['manifest-name'] = [
			'default'  => get_bloginfo('name'),
			'label'    => __('Name', 'progressive-wp'),
			'validate' => null,
		];

		$settings['manifest-short-name'] = [
			'default'  => str_replace(' ', '', get_bloginfo('name')),
			'label'    => __('Short Name', 'progressive-wp'),
			'validate' => null,
		];

		$settings['manifest-starturl'] = [
			'default'  => '',
			'label'    => __('Start Page', 'progressive-wp'),
			'validate' => null,
			'values'   => Helpers::pwpGetPages(),
		];

		$settings['manifest-description'] = [
			'default'  => '',
			'label'    => __('Description', 'progressive-wp'),
			'validate' => null,
		];

		$settings['manifest-display'] = [
			'default'  => 'fullscreen',
			'label'    => __('Display mode', 'progressive-wp'),
			'validate' => null,
			'values'   => [
				'fullscreen' => __('Fullscreen - App takes whole display', 'progressive-wp'),
				'standalone' => __('Standalone - Native App feeling', 'progressive-wp'),
				'minimal-ui' => __('Minimal browser controls', 'progressive-wp'),
			]
		];

		$settings['manifest-orientation'] = [
			'default'  => str_replace(' ', '', get_bloginfo('name')),
			'label'    => __('Orientation', 'progressive-wp'),
			'validate' => null,
			'values'   => [
				'any'       => __('Both', 'progressive-wp'),
				'landscape' => __('Landscape', 'progressive-wp'),
				'portrait'  => __('Portrait', 'progressive-wp'),
			]
		];

		$settings['manifest-theme-color'] = [
			'default'  => '#ff0000',
			'label'    => __('Theme Color', 'progressive-wp'),
			'validate' => null,
		];

		$settings['manifest-background-color'] = [
			'default'  => '',
			'label'    => __('Background Color', 'progressive-wp'),
			'validate' => null,
		];

		return $settings;
	}
}
