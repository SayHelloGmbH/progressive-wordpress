# Progressive WordPress

## Description
It has never been easier to add progressive web app features (PWA) to your WordPress website. It even supports [Accelerate Mobile Pages (AMP)](https://www.ampproject.org/) and is compatible with [OneSignal](https://onesignal.com/)!

### Add to homescreen
Provide an **integrated** user experience!

Progressive WordPress makes it easy to encourage users to add your website to their homescreen. But that's not all. It also allows you to control the display behaviour of your website so it will be shown without any browser elements. Just like a native app.

### Offline usage

Make your website **reliable**. Even on flaky internet connections!

No connection? No problem. Progressive WordPress pre-caches all critical assets of your website, as well as all visited resources. So if there's no internet connection it will serve the resources from the local storage. No more error downasaur!

### Push notifications

**Send push notifications from the WP Admin interface!**

Keep your users **engaged** by sending push notifications!

You just published new content and you want to let everyone know? Why not send a push notification? Progressive WordPress has an integrated connection to Firebase that lets you manage registered devices and send push notifications to all or selected devices!

#### Support for OneSignal
Since Version 2.1.0 Progressive WordPress fully supports [OneSignal](https://onesignal.com/). It detects if the [OneSignal WordPress Plugin](https://wordpress.org/support/plugin/onesignal-free-web-push-notifications/) is active and uses their push messaging functionalities instead.

## ⚡ AMP ready
Progressive WordPress is the first PWA-Plugin for WordPress that also supports Accelerated Mobile Pages!  
It precaches required resources, it adds special AMP caching strategies and it registers the ServiceWorker and the Web App Manifest also on AMP Pages.  
Progressive WordPress currently supports [AMP for WordPress](https://wordpress.org/plugins/amp/) and [AMP for WP – Accelerated Mobile Pages](https://wordpress.org/plugins/accelerated-mobile-pages/).

## Developers
Progressive WordPress offers a lot of possibilities for developers the extend it the way you need it.

### ServiceWorker
**Add pre-cache resource:**  
```php
function myplugin_offline_precache( $caches ) {
    $caches[] = 'https://myurl.com';
    return $caches;
}
add_filter( 'pwp_offline_precache', 'myplugin_offline_precache' );
```

### Manifest
**Change the site Icon**  
By default Progressive WordPress takes the WordPress Favicon as the Site Icon. But you can change that by using this filter:  
```php
function myplugin_manifest_icon( $attachment_is ) {
    return 10; //should be the Post ID of an attachment.
}
add_filter( 'pwp_manifest_icon', 'myplugin_manifest_icon' );
```

**Add content to the manifest:**  
```php
function myplugin_manifest_values( $values ) {
    $values['new'] = 'New';
    return $values; //needs to be valid an array (will be json_endoded)
}
add_filter( 'web_app_manifest', 'myplugin_manifest_values' );
```

### Push notifications
If you are using OneSignal please visit [https://documentation.onesignal.com](https://documentation.onesignal.com).  

**customoize Button**  
If you don't want to use the built in Button, you can create your own from a shortcode or a php function:  
```php
// Shortcode
[pwp_notification_button size="1rem" class="your-class"]

// Function
$atts = [
    'class' => 'notification-button--fixedfooter',
    'style' => "background-color: #ff0000; color: #00ff00; font-size: 35px",
];
pwp_get_notification_button( $atts ); // returns the html template.
```

**Filter: `pwp_notification_button_attributes`**

This filter adds custom attributes to the notification button:
```php
function myplugin_notification_button_atttibutes( $attributes ) {
    $attributes['data-test'] = 'My value';
    return $attributes;
}
add_filter( 'pwp_notification_button_attributes', 'myplugin_notification_button_atttibutes' );
```
The key will be used as attribute key (will be sanitized `sanitize_title()`), the value will be used as attribute value (sanitized with `esc_attr()`).

**Create your own button**  
You are also free to create your own button. The states are indicated as body classes:
* `body.pwp-notification` if push notifications are supported
* `body.pwp-notification.pwp-notification--on` if the device is registered
* `body.pwp-notification.pwp-notification--loader` if there is something loading

You can then use the JS functions `pwpRegisterPushDevice();` and `pwpDeregisterPushDevice();`.

### ⚡ AMP support
Progressive WordPress currently supports [AMP for WordPress](https://wordpress.org/plugins/amp/) and [AMP for WP – Accelerated Mobile Pages](https://wordpress.org/plugins/accelerated-mobile-pages/).  
You can easily make your AMP Theme or Plugin comatible with the following hooks:

**Filter: `pwp_site_supports_amp`**

Should be set to true is the website supports AMP
```php
add_filter( 'pwp_site_supports_amp', '__return_true' );
```

**Filter: `pwp_current_page_is_amp`**

Should be set to true is the website supports AMP
```php
function myplugin_current_page_is_amp( $boolean ) {
	if ( this_site_is_an_amp_site() ) {
		$boolean = true;
	}
	return $boolean;
}
add_filter( 'pwp_current_page_is_amp', 'myplugin_current_page_is_amp' );
```

**Filter: `pwp_get_ampurl_from_url`**

Should return the input-URL or the AMP-Version of this URL if exists.
```php
function myplugin_get_ampurl_from_url( $url ) {
	if ( this_url_amp_url() ) {
		$url = $url . 'amp/';
	}
	return $url;
}
add_filter( 'pwp_get_ampurl_from_url', 'myplugin_get_ampurl_from_url' );
```

You can find a working example here: [https://github.com/SayHelloGmbH/progressive-wordpress/blob/master/3rdparty-support/amp.php](https://github.com/SayHelloGmbH/progressive-wordpress/blob/master/3rdparty-support/amp.php)

Your Theme or plugin should also support the `amp_post_template_head` and `amp_post_template_footer` actions.

## Privacy
This plugin does not use any Cookies. Also it does not collect any personal information without the following

### Push notification
If the user subscribes to push notifications, the following informations will be saved inside the WP database:
* Browser and Version
* Operating System (and Version)
* Device
* Push Notification endpoint (a key that will be generated by the browser and the firebase server so push notifications can be sent)

Also if you send push notifications, those will be passed to [firebase cloud messaging](https://firebase.google.com/docs/cloud-messaging/) and they will send it to the client.

## Changelog

### 2.1.10
* Changed Text Domain from pwp to progressive-wp
* added privacy information to the readme
* short_name can now contain spaces
* added WP Rest to caching strategies

### 2.1.9
* Minor Bugfix (PHP Warning)

### 2.1.8
* Fixed Push notifications

### 2.1.7
* removed jQuery! It's now only pure JavaScript
* conditional JS / CSS loading
* small stability improvements for the Site Icon
* httpsify start url

### 2.1.6
* AMP register ServiceWorker Bugfix

### 2.1.5
* Improvements for service worker registration
* Add to homescreen prompt fix

### 2.1.3
* New Filter to adjust the Site Icon: `pwp_manifest_icon`
* Fix for ServiceWorker registration inside subfolder
* Multisite fixes for OneSignal compatibility

### 2.1.2
* Multisite fixes for OneSignal compatibility

### 2.1.0
* AMP support ⚡
	* Detect if AMP is supported
	* Detect if current site is AMP
	* register ServiceWorker for AMP
	* register Manifest for AMP
	* Add caching strategies for AMP pages and assets
* Compatibility for [AMP for WordPress](https://wordpress.org/plugins/amp/)
* Compatibility for [AMP for WP – Accelerated Mobile Pages](https://wordpress.org/plugins/accelerated-mobile-pages/)
* Compatibility for [OneSignal](https://wordpress.org/support/plugin/onesignal-free-web-push-notifications/)

### 2.0.1
* New caching strategy "Network Only"
* ServiceWorker minify
* Precache fixes

### 2.0.0
* Complete UI over-worked
* Offline support for Google Analytics!
* Settings renamed and rearranged
* Manifest Icon is now the same as Site Icon
* Added [Workbox v3.4.1](https://developers.google.com/web/tools/workbox/)
* Choose caching strategies for different request types
* Future proof: Added support for the [PWA feature plugin](https://github.com/xwp/pwa-wp)

### 1.3.2
* Bugfix: Firebase Serverkey validation
* Bugfix: upload images on settings page

### 1.3.1
* messed up some SVN-deployment

### 1.3.0
* added default settings on activate
* Bugfix: Minifying JS threw an Uncaught SyntaxError

### 1.2.0
* added default settings on activate
* added UTM tracking for manifest starturl and push notification redirect url

### 1.1.2
* required php Version is now 5.6

### 1.1.1
* critical Bugfix: JavaScript error

### 1.1.0
* Bugfix: better way to check if files have to be regenerated
* Bugfix: PushPost not always registered
* Improvement: new manifest icon sizes

### 1.0.2
* Bugfix: CSS z-index for notification button

### 1.0.1
* Bugfix: Pushpost labels
* fixed spelling mistakes

### 1.0.0
* **Stable version 1.0.0**
* added multisite support
* Pushpost: send push notifications right from the post edit screen
* Added translation: de_DE
* Added translation: de_CH
* push button color input-type improvements
* add JS vars as `wp_add_inline_script`

### 0.7.0
* extended developer functionalities
* added a latest push log
* added a debug log
* using `WP_Filesystem` API instead of php `file_put_contents`
* Added "orientation" to manifest
* Added colorpicker to settings
* Fix: is_ssl() improvement

### 0.6.2
* Bugfix: featured image could not be changed if push notifications are enabled

### 0.6.1
* Bugfix: prohibit console error if sw not supported

### 0.6.0
* Added offline content
* select front page as offline Page
* Improvement: better hex check for manifest colors

### 0.5.1
* Bugfix: notification Button always visible

### 0.5.0
* Added push notifications!
    * let the user manage their subscription
    * manage all registered deivces
    * send push notifications to all or specific devices
* added ad status checks
* force the browser to unregister all other serviceworkers
* minor bugfixes and improvements

### 0.4.0
* you can now change the manifest start_url
* Bugfixes

### 0.3.0
* changed offline indicator
* added better instructions
* codepattern improvements

### 0.2.0
* added offline indicator
* Grammatical changes by [Mark Howells-Mead](https://profiles.wordpress.org/markhowellsmead/)
* "installable" is now optional
* Manifest Icon has to be png and min. 144x144px.

### 0.1.0
* Initial version from 2018

## Contributors
* Nico Martin | [nicomartin.ch](https://www.nicomartin.ch) | [@nic_o_martin](https://twitter.com/nic_o_martin)

## License
Use this code freely, widely and for free. Provision of this code provides and implies no guarantee.

Please respect the GPL v3 licence, which is available via [http://www.gnu.org/licenses/gpl-3.0.html](http://www.gnu.org/licenses/gpl-3.0.html)