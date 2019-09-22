<?php

namespace nicomartin\ProgressiveWordPress;

class PushPost {

	public function __construct() {
	}

	public function run() {

		if ( ! pwp_push_set() ) {
			return;
		}

		add_action( 'add_meta_boxes', [ $this, 'meta_box' ] );

		add_action( 'admin_init', [ $this, 'save_post_types' ], 50 );
		add_action( 'pwp_settings', [ $this, 'settings' ] );
		add_filter( 'pwp_admin_footer_js', [ $this, 'post_types_footer' ] );
	}

	public function meta_box() {

		foreach ( get_option( 'pwp_post_types' ) as $pt => $values ) {
			if ( ! pwp_get_setting( "pwp_pushpost_active_{$pt}" ) ) {
				continue;
			}
			add_meta_box( 'pushpost-meta-box', __( 'PWA Push', 'progressive-wp' ), function ( $post ) use ( $pt ) {

				$title = pwp_get_setting( "pwp_pushpost_title_{$pt}" );
				$title = str_replace( '{post_title}', get_the_title( $post ), $title );
				$body  = pwp_get_setting( "pwp_pushpost_body_{$pt}" );
				$body  = str_replace( '{post_title}', get_the_title( $post ), $body );

				$class = '';
				if ( get_post_meta( $post->ID, 'pwp_pushpost', true ) == 'done' ) {
					$class = 'pushpost-done';
				}
				echo '<div class="pushpost-meta-container ' . $class . '">';
				echo '<div class="pushpost-meta pushpost-meta--send">';
				echo '<p>' . __( 'This function opens the push notification modal for this post.', 'progressive-wp' ) . '</p>';
				echo pwp_get_instance()->Push->render_push_modal( $title, $body, get_permalink( $post ), get_post_thumbnail_id( $post ), '', $post->ID );
				echo '</div>';

				echo '<div class="pushpost-meta pushpost-meta--done">';
				echo '<p>' . __( 'Push notification has already been sent. Do you want to send it again?', 'progressive-wp' ) . '</p>';
				echo '<p><a class="pushpost-meta__sendagain" data-confirmation="' . esc_attr( __( 'Are you sure you want to send a new push notification?', 'progressive-wp' ) ) . '">' . __( 'Send again', 'progressive-wp' ) . '</a></p>';
				echo '</div>';
				echo '</div>';
			}, $pt, 'side' );
		}
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

		$save = [];
		foreach ( $post_types as $pt ) {
			$obj         = get_post_type_object( $pt );
			$save[ $pt ] = [
				'name'          => $obj->labels->name,
				'singular_name' => $obj->labels->singular_name,
			];
		}

		update_option( 'pwp_post_types', $save );
	}

	public function settings() {

		$post_types = get_option( 'pwp_post_types' );
		if ( ! is_array( $post_types ) ) {
			return;
		}

		$section_desc = __( 'This will add a meta box to the post edit screen, where you can easily send a push notification for this post.', 'progressive-wp' );
		// translators: `{post_title}` will be replaced with the post title.
		$section_desc .= sprintf( __( '%s will be replaced with the post title.', 'progressive-wp' ), '<code>{post_title}</code>' );
		$section      = pwp_settings()->add_section( pwp_settings_page_push(), 'pwp_pushpost', __( 'Push Post', 'progressive-wp' ), $section_desc );

		foreach ( $post_types as $pt => $labels ) {

			if ( ! is_array( $labels ) ) {
				continue;
			}

			$label          = $labels['name'];
			$singular_label = $labels['singular_name'];

			// translators: "PushPost" for Post
			$name = sprintf( __( 'Push Post for "%s"', 'progressive-wp' ), $label );
			pwp_settings()->add_checkbox( $section, "pwp_pushpost_active_{$pt}", $name );

			// translators: Post: Title
			$name    = sprintf( __( '%s: Title', 'progressive-wp' ), $label );
			$default = '{post_title}';
			pwp_settings()->add_input( $section, "pwp_pushpost_title_{$pt}", $name, $default );

			// translators: Post: Body
			$name = sprintf( __( '%s: Body', 'progressive-wp' ), $label );
			// translators: New Post-Type published
			$default = sprintf( __( 'New %s published!', 'progressive-wp' ), $singular_label );
			pwp_settings()->add_input( $section, "pwp_pushpost_body_{$pt}", $name, $default );

			pwp_settings()->add_spacer( $section, "pwp_pushpost_spacer_{$pt}" );
		}
	}

	public function post_types_footer( $atts ) {
		$atts['post_types'] = get_option( 'pwp_post_types' );

		return $atts;
	}
}
