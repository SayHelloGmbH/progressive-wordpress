<?php

namespace nicomartin\ProgressiveWordPress;

class Settings {

	public static $key = 'pwp-settings';
	public $registeredSettings = [];

	public function __construct() {
		$this->registeredSettings = apply_filters( 'pwp_register_setting', $this->registeredSettings );
	}

	public function run() {
		add_action( 'rest_api_init', [ $this, 'registerRoute' ] );
	}

	public function registerRoute() {
		register_rest_route( pwp_get_instance()->apiNamespace, 'settings', [
			'methods'  => 'POST',
			'callback' => [ $this, 'apiUpdateSetting' ],
		] );

		register_rest_route( pwp_get_instance()->prefix, 'settings', [
			'methods'  => 'GET',
			'callback' => [ $this, 'apiGetSettings' ],
		] );
	}

	public function apiUpdateSetting( $req ) {
		$settings = $req->get_param( 'settings' );
		$errors   = [];

		foreach ( $settings as $key => $value ) {
			$validate = $this->validateSetting( $key, $value );
			if ( is_wp_error( $validate ) ) {
				$errors[ $key ] = $validate->get_error_message();
			}
		}

		if ( count( $errors ) !== 0 ) {
			return new \WP_Error( 'validation_failed', 'Validation Failed', [
				'status' => 401,
				'data'   => $errors,
			] );
		}

		$options = $this->getSettings();

		update_option( self::$key, array_merge( $options, $settings ) );

		return $this->getSettings();
	}

	public function apiGetSettings() {
		if ( Helpers::check_auth() ) {
			return new \WP_Error( 'unauthorized', 'Unauthorized', [
				'status' => 401,
			] );
		}

		$return            = [];
		$validSettingsKeys = array_keys( $this->registeredSettings );
		foreach ( $validSettingsKeys as $key ) {
			$return[ $key ] = $this->getSingleSetting( $key, $this->getSettings() );
		}

		return $return;
	}

	public function registerSetting( string $key, string $defaultValue, $validation ) {
		$this->registeredSettings[ $key ] = [
			'default'  => $defaultValue,
			'validate' => $validation ? function ( $value ) use ( $validation ) {
				return $validation( $value );
			} : null
		];
	}

	public function getSettings( array $keysToReturn = [] ): array {
		$savedOptions = get_option( self::$key );

		if ( count( $keysToReturn ) === 0 ) {
			$keysToReturn = array_keys( $this->registeredSettings );
		}

		$settingsToReturn = [];
		foreach ( $keysToReturn as $settingsKey ) {
			$settingsToReturn[ $settingsKey ] = in_array( $settingsKey, $savedOptions ) ? $savedOptions[ $settingsKey ] : $this->registeredSettings[ $settingsKey ]['default'];
		}

		return $settingsToReturn;
	}

	public function getSingleSetting( string $key, $allSettings = null ) {
		if ( ! array_key_exists( $key, $this->registeredSettings ) ) {
			return null;
		}

		if ( $allSettings === null ) {
			$allSettings = $this->getSettings( [ $key ] );
		}

		return $allSettings[ $key ];
	}

	public function validateSetting( string $key, $value ) {
		if ( ! array_key_exists( $key, $this->registeredSettings ) ) {
			return new \WP_Error( 'invalid_setting', "Invalid Settings key '${$key}'" );
		}

		$validate = $this->registeredSettings[ $key ]['validate'] ? $this->registeredSettings[ $key ]['validate']( $value ) : '';
		if ( $validate !== '' ) {
			return new \WP_Error( 'invalid_setting_value', $validate );
		}

		return true;
	}
}
