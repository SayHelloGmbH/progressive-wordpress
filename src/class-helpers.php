<?php

namespace nicomartin\ProgressiveWordPress;

class Helpers {
	public static function check_auth() {
		return current_user_can( 'administrator' );
	}
}
