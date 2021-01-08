<?php

namespace nicomartin\ProgressiveWordPress\API;

class Settings {

	public static string $key = 'pwp-settings';

	public function run() {
		register_rest_route( pwp()->prefix, 'settings', [
			'methods'  => 'POST',
			'callback' => [ $this, 'updateSetting' ],
		] );

		register_rest_route( pwp()->prefix, 'settings', [
			'methods'  => 'GET',
			'callback' => [ $this, 'getSettings' ],
		] );
	}

	public function updateSetting( $req ) {
		$settings = $req->get_param( 'settings' );
		$options  = self::getOptions();

		update_option( self::$key, array_merge( $options, $settings ) );

		return self::getOptions();
	}

	public function getSettings() {
		if ( \nicomartin\ProgressiveWordPress\Helpers::check_auth() ) {
			return new \WP_Error( 'unauthorized', 'Unauthorized', [
				'status' => 401,
			] );
		}

		return self::getOptions();
	}

	public static function getOptions( array $options = [] ): array {
		$savedOptions = get_option( self::$key );

		if ( count( $options ) === 0 ) {
			return $savedOptions;
		}

		$return = [];
		foreach ( $options as $option ) {
			if ( in_array( $option, $savedOptions ) ) {
				$return[ $option ] = $savedOptions[ $option ];
			}
		}

		return $return;
	}
}
