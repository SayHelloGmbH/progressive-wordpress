<?php

namespace nicomartin\ProgressiveWordPress;

/**
 * Class Settings
 * @package nicomartin\ProgressiveWordPress
 */

class Settings {

	private static $instance;

	public $prefix = '';
	public $parent_page = '';
	public $capability = '';
	public $option_key = '';

	public $init_action = '';
	public $sanitize_filter = '';
	public $sanitize_action = '';
	public $aftersave_action = '';

	private $pages = '';
	private $sections = '';
	private $settings = '';

	private $debug = false;

	public static function get_instance( $key ) {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Settings ) ) {
			self::$instance = new Settings( $key );
		}

		return self::$instance;
	}

	private function __construct( $key ) {

		$this->parent_page      = 'options-general.php';
		$this->prefix           = $key;
		$this->capability       = 'administrator';
		$this->option_key       = "{$key}-settings";
		$this->init_action      = "{$key}_settings";
		$this->sanitize_action  = "{$key}_on_sanitize"; // {sanitize_on_action}_{field_key}
		$this->sanitize_filter  = "{$key}_sanitize"; // {sanitize_filter}_{field_key}
		$this->aftersave_action = "{$key}_after_save";

		$this->pages    = [];
		$this->sections = [];
		$this->settings = [];

		add_action( 'admin_init', [ $this, 'after_saved_hook' ], 50 );
		add_action( 'init', [ $this, 'settings_init_hook' ] );
		add_action( 'admin_menu', [ $this, 'register_pages' ] );
		add_action( 'admin_init', [ $this, 'register_settings' ] );
	}

	public function after_saved_hook() {

		if ( array_key_exists( "{$this->prefix}_sanitize_ongoing", $_COOKIE ) && 'yes' == $_COOKIE[ $this->prefix . '_sanitize_ongoing' ] ) {
			add_action( 'admin_notices', function () {
				echo '<div id="setting-error-pwp_settings_updated" class="notice notice-success is-dismissible">';
				echo '<p><strong>' . __( 'Settings saved.', 'progressive-wp' ) . '</strong></p>';
				echo '</div>';
			} );
			do_action( $this->aftersave_action );
		}

		setcookie( "{$this->prefix}_sanitize_ongoing", 'no', time() + 60 * 60, '/' );
	}

	public function settings_init_hook() {
		do_action( $this->init_action );
	}

	public function register_pages() {
		foreach ( $this->pages as $key => $name ) {
			add_submenu_page( $this->parent_page, $name, $name, $this->capability, $key, function () use ( $name, $key ) {
				?>
				<div class="wrap <?php echo $this->prefix; ?>-wrap <?php echo $key; ?>-wrap">
					<h1><?php echo $name; ?></h1>
					<div class="<?php echo $this->prefix; ?>-wrap__content">
						<?php
						if ( $this->debug ) {
							echo '<pre>';
							echo esc_html( print_r( $this->get_settings(), true ) );
							echo '</pre>';
						}
						?>
						<form method="post" action="options.php">
							<?php
							settings_errors( "{$this->prefix}-errors" );
							settings_fields( "{$this->prefix}-group" );
							$this->do_settings_sections( $key );
							submit_button();
							?>
						</form>
					</div>
				</div>
				<?php
			} );
		}
	}

	public function register_settings() {

		register_setting( "{$this->prefix}-group", $this->option_key, [ $this, 'sanitize' ] );
		foreach ( $this->sections as $key => $values ) {
			add_settings_section( $key, $values['title'], function () use ( $values ) {
				echo wpautop( $values['description'] );
			}, $values['page'] );
		}

		foreach ( $this->settings as $key => $values ) {
			$args = [
				'label_for' => $key,
			];
			add_settings_field( $key, $values['name'], function () use ( $key, $values ) {

				$choices = [];
				if ( 'select' == $values['type'] ) {
					$choices = $values['choices'];
				}

				$args = array_merge( [
					'pre_field'   => '',
					'after_field' => '',
				], $values['args'] );

				echo $args['pre_field'];
				echo $this->do_field( $key, $values['type'], $choices, $args );
				echo $args['after_field'];
			}, $values['page'], $values['section'], $args );
		}
	}

	public function sanitize( $input ) {

		setcookie( "{$this->prefix}_sanitize_ongoing", 'yes', time() + 60 * 60, '/' );

		do_action( "{$this->sanitize_action}", $input );
		foreach ( $input as $key => $val ) {
			do_action( "{$this->sanitize_action}_{$key}", $val, $input );
		}

		$defaults = $this->get_settings();
		foreach ( $defaults as $key => $old_val ) {
			if ( isset( $this->settings[ $key ] ) && 'message' == $this->settings[ $key ]['type'] ) {
				continue;
			}
			if ( isset( $input[ $key ] ) ) {
				$input[ $key ] = esc_html( apply_filters( "{$this->sanitize_filter}_{$key}", $input[ $key ] ) );
			} else {
				$input[ $key ] = $old_val;
			}
		}

		apply_filters( "{$this->sanitize_filter}", $input );

		return $input;
	}

	/**
	 * Helpers
	 */

	private function do_field( $key, $type, $choices = [], $args = [] ) {
		$val    = $this->get_setting( $key );
		$return = '';
		switch ( $type ) {
			case 'checkbox':
				$return .= sprintf( '<input type="hidden" value="0" name="%1$s[%2$s]"/><input type="checkbox" name="%1$s[%2$s]" value="1" id="%2$s" %3$s />', $this->option_key, $key, ( true == $val ? 'checked' : '' ) );
				break;
			case 'select':
				$return .= sprintf( '<select name="%1$s[%2$s]" id="%2$s">', $this->option_key, $key );
				foreach ( $choices as $option_key => $option_val ) {
					$selected = ( $val == $option_key ? 'selected' : '' );
					$return   .= "<option value='{$option_key}' {$selected}>{$option_val}</option>";
				}
				$return .= '</select>';
				break;
			case 'textarea':
				$return .= sprintf( '<textarea name="%1$s[%2$s]" id="%2$s">%3$s</textarea>', $this->option_key, $key, $val );
				break;
			case 'color':
				$return .= sprintf( '<input type="text" name="%1$s[%2$s]" class="settings--colorpicker" id="%2$s" value="%3$s" />', $this->option_key, $key, $val );
				break;
			case 'message':
				$return .= $val;
				break;
			case 'file':
				$file_id = $val;
				if ( 'attachment' != get_post_type( intval( $file_id ) ) ) {
					$file_id = 0;
				}

				if ( 0 == $file_id ) {
					$preview = '';
				} elseif ( wp_attachment_is_image( $file_id ) ) {
					$preview = wp_get_attachment_image( $file_id );
				} else {
					$file    = get_post( $file_id );
					$preview = '<a target="_blank" href="' . wp_get_attachment_url( $file_id ) . '">' . get_the_title( $file_id ) . "</a> ({$file->post_mime_type})";
				}

				wp_enqueue_media();
				$data = [
					'mimes'      => '',
					'min-width'  => '',
					'max-width'  => '',
					'min-height' => '',
					'max-height' => '',
				];

				if ( array_key_exists( 'mimes', $args ) ) {
					$data['mimes'] = explode( ',', $args['mimes'] );
					$data['mimes'] = array_map( 'sanitize_title', $data['mimes'] );
					$data['mimes'] = esc_attr( implode( ', ', $data['mimes'] ) );
				}

				foreach ( [ 'min-width', 'max-width', 'min-height', 'max-height' ] as $size ) {
					if ( array_key_exists( $size, $args ) ) {
						$data[ $size ] = intval( $args[ $size ] );
					}
				}

				$data_atts = [];
				foreach ( $data as $d_key => $d_val ) {
					$data_atts[] = "data-$d_key='$d_val'";
				}
				$data_atts = implode( ' ', $data_atts );

				$return .= "<div class='settings--fileuploader' data-fileid='{$file_id}' $data_atts>";
				$return .= '<div class="fileuploader__preview">' . $preview . '</div>';
				$return .= '<p class="fileuploader__controls">';
				$return .= '<a class="button select-file">Upload</a>';
				$return .= '<a class="button button--pwp-settings-delete delete-file">Delete</a>';
				$return .= '</p>';
				$return .= sprintf( '<input type="hidden" name="%1$s[%2$s]" id="%2$s" value="%3$s" />', $this->option_key, $key, $val );
				$return .= '</div>';
				break;
			case 'spacer':
				$return .= "<div class='{$this->option_key}--spacer'></div>";
				break;
			default:
				$return .= sprintf( '<input type="text" name="%1$s[%2$s]" id="%2$s" value="%3$s" />', $this->option_key, $key, $val );
		} // End switch().

		return $return;
	}

	private function do_settings_sections( $page ) {
		global $wp_settings_sections, $wp_settings_fields;
		if ( ! isset( $wp_settings_sections[ $page ] ) ) {
			return;
		}

		foreach ( (array) $wp_settings_sections[ $page ] as $section ) {
			echo '<div class="' . $this->prefix . '-wrap__section settings-section">';
			if ( $section['title'] ) {
				echo "<h2>{$section['title']}</h2>\n";
			}
			if ( $section['callback'] ) {
				call_user_func( $section['callback'], $section );
			}
			if ( ! isset( $wp_settings_fields ) || ! isset( $wp_settings_fields[ $page ] ) || ! isset( $wp_settings_fields[ $page ][ $section['id'] ] ) ) {
				echo '</div>';
				continue;
			}
			echo '<table class="form-table">';
			do_settings_fields( $page, $section['id'] );
			echo '</table>';
			echo '</div>';
		}
	}

	/**
	 * Public setters
	 */

	public function set_parent_page( $parent_slug ) {
		$this->parent_page = $parent_slug;
	}

	public function set_capability( $cap ) {
		$this->capability = $cap;
	}

	public function set_debug( $debug ) {
		if ( ! is_bool( $debug ) ) {
			$this->debug = false;
		}
		$this->debug = $debug;
	}

	/**
	 * Public Methods
	 */

	public function get_settings() {
		$defaults = [];
		foreach ( $this->settings as $key => $vals ) {
			$defaults[ $key ] = $vals['default'];
		}

		return wp_parse_args( get_option( $this->option_key ), $defaults );
	}

	public function get_setting( $key ) {
		$options = $this->get_settings();
		if ( isset( $options[ $key ] ) ) {
			return $options[ $key ];
		}

		if ( ! isset( $this->settings[ $key ] ) ) {
			return false;
		}

		return $this->settings[ $key ]['default'];
	}

	public function add_page( $key, $title ) {
		$this->pages[ $key ] = $title;

		return $key;
	}

	public function add_section( $page, $key, $title, $description = '' ) {

		if ( ! isset( $this->pages[ $page ] ) ) {
			return false;
		}

		$key = "{$this->prefix}-section-{$key}";

		$this->sections[ $key ] = [
			'title'       => $title,
			'page'        => $page,
			'description' => $description,
		];

		return $key;
	}

	/**
	 * Input fields
	 */

	public function add_input( $section, $key, $name, $default = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'input',
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_textarea( $section, $key, $name, $default = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'textarea',
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_checkbox( $section, $key, $name, $default = false, $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'checkbox',
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_select( $section, $key, $name, $choices, $default = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		if ( '' == $default || ! isset( $choices[ $default ] ) ) {
			$default = current( array_keys( $choices ) );
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'select',
			'choices' => $choices,
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_message( $section, $key, $name, $message = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'message',
			'default' => $message,
			'args'    => $args,
		];

		return $key;
	}

	public function add_file( $section, $key, $name, $default = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		if ( 'attachment' != get_post_type( intval( $default ) ) ) {
			$default = 0;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'file',
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_color( $section, $key, $name, $default = '', $args = [] ) {
		if ( ! isset( $this->sections[ $section ] ) ) {
			return false;
		}

		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => $name,
			'type'    => 'color',
			'default' => $default,
			'args'    => $args,
		];

		return $key;
	}

	public function add_spacer( $section, $key ) {
		$this->settings[ $key ] = [
			'page'    => $this->sections[ $section ]['page'],
			'section' => $section,
			'name'    => '',
			'type'    => 'spacer',
			'default' => '',
			'args'    => [],
		];

		return $key;
	}
}
