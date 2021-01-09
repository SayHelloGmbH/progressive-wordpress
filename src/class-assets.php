<?php

namespace nicomartin\ProgressiveWordPress;

class Assets {
	public function run() {
		add_action( 'wp_enqueue_scripts', [ $this, 'add_assets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'add_admin_assets' ] );
	}

	public function add_assets() {
		$scriptVersion = pwp_get_instance()->version;
		$dirUri        = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );
	}

	public function add_admin_assets() {
		$scriptVersion = pwp_get_instance()->version;
		$dirUri        = trailingslashit( plugin_dir_url( pwp_get_instance()->file ) );

		wp_enqueue_script( 'react', $dirUri . 'assets/react.production.min.js', [], '17', true );
		wp_enqueue_script( 'react-dom', $dirUri . 'assets/react-dom.production.min.js', [], '17', true );

		wp_enqueue_style( pwp_get_instance()->prefix . '-admin-style', $dirUri . 'assets/dist/admin.css', [], $scriptVersion );
		wp_enqueue_script( pwp_get_instance()->prefix . '-admin-script', $dirUri . 'assets/dist/admin.js', [
			'react',
			'react-dom'
		], $scriptVersion, true );

		/**
		 * Admin Footer JS
		 */

		$defaults = [
			'ajaxUrl'            => admin_url( 'admin-ajax.php' ),
			'homeUrl'            => trailingslashit( get_site_url() ),
			'generalError'       => __( 'An unexpected error occured', 'progressive-wp' ),
			'settings'           => pwp_get_instance()->settings->getSettings(),
			'translationStrings' => apply_filters( 'pwp_translation_strings', [] )
		];

		$vars = json_encode( apply_filters( 'pwp_admin_footer_js', $defaults ) );

		wp_add_inline_script( pwp_get_instance()->prefix . '-admin-script', "var PwpJsVars = {$vars};", 'before' );
	}
}
