# Progressive WordPress

## Description
This plugin adds progressive web app features to your WordPress site.

### Web App Manifest
Create a web app manifest using the WordPress backend. **No coding skills required!**

### Installable
Provide an awesome app-like experience while making your website installable. It uses the data defined in manifest.json.

### Offline usage
No connection? No problem!  
This feature allows you to provide offline usage for your website.
A copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline.  The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache.

### Push notifications

**Send push notifications from the WP Admin interface!**

This plugin uses Firebase Cloud Messaging as a messaging service: [https://firebase.google.com/](https://firebase.google.com/)  
Please register your application there. You will need the `Server Key` and the `Sender ID`.

Progressive WordPress comes with an integrated notification button where the user can register an unregister for push notification. You can either use the built in fixed button from the admin panel or you can add your own button as a shortcode `[pwp_notification_button size="1rem"]`.  
You are also free to create your own button. The states are indicated as body classes:
* `body.pwp-notification` if push notifications are supported
* `body.pwp-notification.pwp-notification--on` if the device is registered
* `body.pwp-notification.pwp-notification--loader` if there is something loading

You can then use `pwpRegisterPushDevice()` and `pwpDeregisterPushDevice()` as JavaScript functions from the widow object.

After those steps you will have an overview about all registered devices, you can manage them and you can send push notifications to all of them or selected devices. Awesome, right!?

## Changelog

### 0.7.0
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