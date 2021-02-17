<?php

namespace nicomartin\ProgressiveWordPress;

class Tracking
{
    public $trackingKeys = [];

    public function __construct()
    {
        $this->trackingKeys = [
            'source'   => __('Campaign Source', 'progressive-wp'),
            'medium'   => __('Campaign Medium', 'progressive-wp'),
            'term'     => __('Campaign Term', 'progressive-wp'),
            'content'  => __('Campaign Content', 'progressive-wp'),
            'campaign' => __('Campaign Name', 'progressive-wp')
        ];
    }

    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_admin_footer_js', [$this, 'footerJs']);
        add_filter(RegisterManifest::$filter, [$this, 'trackingToStartUrl'], 500);
    }

    public function settings($settings)
    {
        foreach ($this->trackingKeys as $key => $label) {
            $settings["manifest-tracking-starturl-{$key}"] = [
                'default'  => '',
                'label'    => $label,
                'validate' => null,
            ];
        }

        return $settings;
    }

    public function footerJs($values)
    {
        $values['trackingParamKeys'] = array_keys($this->trackingKeys);

        return $values;
    }

    public function trackingToStartUrl($manifest)
    {
        $queryParams = [];
        foreach ($this->trackingKeys as $key => $label) {
            $value = pwpGetInstance()->Settings->getSingleSettingValue("manifest-tracking-starturl-{$key}");
            if ($value) {
                $queryParams[] = "utm_{$key}={$value}";
            }
        }

        if (count($queryParams) !== 0 && array_key_exists('start_url', $manifest)) {
            $manifest['start_url'] = $manifest['start_url'] . '?' . join('?', $queryParams);
        }

        return $manifest;
    }
}
