<?php

namespace nicomartin\ProgressiveWordPress;

class PushPost {

	public function __construct() {
	}

	public function run() {

		if ( ! pwp_push_set() ) {
			return;
		}

		add_action( 'admin_init', [ $this, 'save_post_types' ], 50 );
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_filter( 'pwp_admin_footer_js', [ $this, 'post_types_footer' ] );
	}

	public function save_post_types() {

		$post_types_builtin = get_post_types( [
			'public'   => true,
			'show_ui'  => true,
			'_builtin' => true,
		] );

		$post_types = get_post_types( [
			'public'   => true,
			'show_ui'  => true,
			'_builtin' => false,
		] );

		$post_types = array_merge( $post_types_builtin, $post_types );
		unset( $post_types['attachment'] );

		update_option( 'pwp_post_types', $post_types );
	}

	public function settings() {

		$post_types = get_option( 'pwp_post_types' );

		// translators: `{post_title}` will be replaced with the post title.
		$section_desc = sprintf( __( '%s will be replaced with the post title.', 'pwp' ), '<code>{post_title}</code>' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_pushpost', __( 'Push Post', 'pwp' ), $section_desc );

		foreach ( $post_types as $pt => $name ) {
			$post_type = get_post_type_object( $pt );

			// translators: "PushPost" for Post
			$name = sprintf( __( 'Push Post for "%s"', 'pwp' ), $post_type->label );
			pwp_settings()->add_checkbox( $section, "pwp_pushpost_active_{$pt}", $name );

			// translators: Post: Title
			$name    = sprintf( __( '%s: Title', 'pwp' ), $post_type->label );
			$default = '{post_title}';
			pwp_settings()->add_input( $section, "pwp_pushpost_title_{$pt}", $name, $default );

			// translators: Post: Body
			$name = sprintf( __( '%s: Body', 'pwp' ), $post_type->label );
			// translators: New Post-Type published
			$default = sprintf( __( 'New %s published!' ), $post_type->labels->singular_name );
			pwp_settings()->add_input( $section, "pwp_pushpost_body_{$pt}", $name, $default );

			pwp_settings()->add_spacer( $section, "pwp_pushpost_spacer_{$pt}" );
		}
	}

	public function post_types_footer( $atts ) {
		$atts['post_types'] = get_option( 'pwp_post_types' );

		return $atts;
	}
}
