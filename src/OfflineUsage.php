<?php

namespace nicomartin\ProgressiveWordPress;

class OfflineUsage
{
    public function run()
    {
        add_filter('pwp_register_settings', [$this, 'settings']);
        //add_filter('pwp_admin_footer_js', [$this, 'addPagesObject']);
    }

    public function settings($settings)
    {

        $settings['offline-page'] = [
            'default'  => 'normal',
            'label'    => __('Offline fallback Page', 'progressive-wp'),
            'validate' => null,
            'values'   => Helpers::getPages(),
        ];

        $settings['offline-content'] = [
            'default'  => 'normal',
            'label'    => __('Offline Content', 'progressive-wp'),
            'validate' => null,
        ];

        return $settings;
    }

    public function addPagesObject($vars)
    {
        $choices = [];
        foreach (get_pages() as $post) {
            $choices[] = [
                'id'     => $post->ID,
                'string' => get_the_title($post)
            ];
        }

        $vars['pages'] = Helpers::getPages();

        return $vars;
    }
}
