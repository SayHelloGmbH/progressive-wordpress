<?php

namespace nicomartin\ProgressiveWordPress;

class OfflineIndicator
{
    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_action('wp_footer', [$this, 'offlineIndicatorTemplate'], 999);
    }

    public function settings($settings)
    {
        $settings['offline-indicator'] = [
            'default'  => false,
            'label'    => __('Offline indicator', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['offline-indicator-text'] = [
            'default'  => __("you're currently offline", 'progressive-wp'),
            'label'    => __('Message', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['offline-indicator-position'] = [
            'default'  => 'bottom',
            'label'    => __('Position', 'progressive-wp'),
            'validate' => null,
            'values'   => [
                'bottom' => __('Bottom', 'progressive-wp'),
                'top'    => __('Top', 'progressive-wp'),
            ],
        ];

        $settings['offline-indicator-color-text'] = [
            'default'  => '#ffffff',
            'label'    => __('Textcolor', 'progressive-wp'),
            'validate' => null,
        ];

        $settings['offline-indicator-color-background'] = [
            'default'  => '#000000',
            'label'    => __('Background-Color', 'progressive-wp'),
            'validate' => null,
        ];

        return $settings;
    }

    public function offlineIndicatorTemplate()
    {
        $indicator = pwpGetInstance()->Settings->getSingleSettingValue('offline-indicator');

        if ($indicator === false) {
            return;
        }

        $text     = pwpGetInstance()->Settings->getSingleSettingValue('offline-indicator-text');
        $position = pwpGetInstance()->Settings->getSingleSettingValue('offline-indicator-position');

        $textcolor = pwpGetInstance()->Settings->getSingleSettingValue('offline-indicator-color-text');
        $bkgcolor  = pwpGetInstance()->Settings->getSingleSettingValue('offline-indicator-color-background');

        echo "<div class='offline-indicator offline-indicator--$position' style='background-color: $bkgcolor' hidden='true'>";
        echo "<p style='color:$textcolor'>$text</p>";
        echo '</div>';
    }
}
