<?php

namespace nicomartin\ProgressiveWordPress;

class Helpers {
	public static function check_auth(): bool {
		return current_user_can( 'administrator' );
	}
}