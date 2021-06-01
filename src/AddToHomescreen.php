<?php

namespace nicomartin\ProgressiveWordPress;

class AddToHomescreen
{
    public function run()
    {
        add_filter('pwp_plugin_strings', [$this, 'pluginStrings']);
        add_filter('pwp_register_settings', [$this, 'settings']);
        add_filter('pwp_footer_js', [$this, 'footerVars']);
        add_filter(RegisterManifest::$filter, [$this, 'manifestValues']);
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
                    return sprintf(
                        __('"Mode" has to be one of those values: %s', 'progressive-wp'),
                        join(',', $installableModes)
                    );
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
            'values'   => Helpers::getPages(),
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

    public function footerVars($vars)
    {
        $mode            = $this->getSetting('installable-mode');
        $elementSelector = $this->getSetting('installable-onclick');

        $vars['installpromptMode']    = $mode;
        $vars['installpromptElement'] = null;
        if ($mode === 'trigger' && $elementSelector !== '') {
            $vars['installpromptElement'] = $elementSelector;
        }

        return $vars;
    }

    public function manifestValues($manifest)
    {
        $manifest['name']             = $this->getSetting('manifest-name');
        $manifest['short_name']       = $this->getSetting('manifest-short-name');
        $manifest['start_url']        = $this->getSetting('manifest-starturl');
        $manifest['description']      = $this->getSetting('manifest-description');
        $manifest['theme_color']      = $this->sanitizeHex($this->getSetting('manifest-theme-color'), '#000000');
        $manifest['background_color'] = $this->sanitizeHex($this->getSetting('manifest-background-color'), '#ffffff');
        if ('none' == $this->getSetting('installable-mode')) {
            $manifest['display'] = 'browser';
        } else {
            $manifest['display'] = $this->getSetting('manifest-display');
        }
        $manifest['orientation'] = $this->getSetting('manifest-orientation');

        $sizes      = [144, 192, 512, 524];
        $icon       = apply_filters('pwp_manifest_icon', get_option('site_icon'));
        $icon_width = wp_get_attachment_image_src($icon, 'full')[1];
        if (wp_attachment_is_image(intval($icon))) {
            foreach ($sizes as $size) {
                if ($icon_width < $size) {
                    continue;
                }
                $new_image = Helpers::imageResize($icon, $size, $size, true, 'png');
                if ($new_image[1] != $size) {
                    continue;
                }
                $manifest['icons'][] = [
                    'src'     => $new_image[0],
                    'sizes'   => "{$size}x{$size}",
                    'type'    => 'image/png',
                    'purpose' => 'any maskable',
                ];
            }
        }

        return $manifest;
    }

    /**
     * Helpers
     */

    public function getSetting($key)
    {
        return pwpGetInstance()->Settings->getSingleSettingValue($key);
    }

    public function sanitizeHex($hex, $default = '#ffffff')
    {
        return sanitize_hex_color($hex) == '' ? $default : $hex;
    }
}
