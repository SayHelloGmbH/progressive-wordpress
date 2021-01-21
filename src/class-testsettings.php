<?php

namespace nicomartin\ProgressiveWordPress;

class TestSettings {

	public function __construct() {
	}

	public function run() {
		add_filter( 'pwp_register_settings', [ $this, 'register_settings' ] );
	}

	public function register_settings( $settings ) {
		$settings['myString'] = [
			'default'  => 'default value',
			'validate' => null,
		];

    $settings['myStringArea'] = [
      'default'  => '',
      'validate' => null,
    ];

		$settings['mySelectValue'] = [
			'default'  => '',
			'validate' => function($value){
		  if($value !== 'green'){
		    return 'muss Green sein';
      }
		  return '';
      },
		];

		$settings['myCheckox'] = [
			'default'  => true,
			'validate' => null,
		];

		$settings['myRadio'] = [
			'default'  => '',
			'validate' => null,
		];

		$settings['myImages'] = [
			'default'  => '',
			'validate' => null,
		];

    $settings['myEmail'] = [
      'default'  => 'test@nico.dev',
      'validate' => null,
    ];

		return $settings;
	}
}
