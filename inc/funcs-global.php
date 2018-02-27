<?php

function pwp_serviceworker_regenerate() {
	pwp_get_instance()->Serviceworker->regenerate();
}

function pwp_manifest_regenerate() {
	pwp_get_instance()->Manifest->save_manifest();
}
