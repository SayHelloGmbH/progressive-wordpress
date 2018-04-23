=== Progressive WordPress (PWA) ===
Contributors: nico_martin
Donate link: https://www.paypal.me/NicoMartin
Tags: PWA, Progressive Web App, Progressive Web Application, progressive, installable, offline, offline usage, push notifications, manifest, web app manifest, serviceworker
Requires at least: 4.7
Tested up to: 4.9.5
Stable tag: 1.1.1
Requires PHP: 5.4
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

== Description ==

This plugin adds progressive web app features to your WordPress site.

= Web App Manifest =

Create a web app manifest from the WordPress backend. **No coding skills required!**

= Installable =

Provide an awesome app-like experience while making your website installable. Makes use of the data from manifest.json.

= Offline usage =

No connection? No problem!
This feature allows you to provide offline usage for your website.
A copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline.  The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache.

= Push notifications =

**Send push notifications from the WP Admin interface!**

This plugin uses Firebase Cloud Messaging as a messaging service: [https://firebase.google.com/](https://firebase.google.com/)
Please register your application there. You will need the `Server Key` and the `Sender ID`.

Progressive WordPress comes with an integrated notification button where the user can register an unregister for push notification. You can either use the built in fixed button from the admin panel or you could have a look at the **Developers** section.

After those steps you will have an overview about all registered devices, you can manage them and you can send push notifications to all of them or selected devices. Awesome, right!?

= Developers =
Progressive WordPress offers a lot of possibilities for developers the extend it the way they need it.
[https://github.com/nico-martin/progressive-wordpress#developers](https://github.com/nico-martin/progressive-wordpress#developers)

== Screenshots ==

1. Make your website installable
2. Create a Web App Manifest..
3. ..no coding skills required
4. Make your app ready for offline use
5. Manage the registered devices
6. create a push notification from the admin intefrace
7. let the magic happen

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/` directory or install it from the plugin directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Done

== Frequently Asked Questions ==

= Nothing happens after installation =

1. Please visit the "Status" section on the "About" page. Everything green?
2. Are you using a device/browser that supports serviceworkers? [https://caniuse.com/#feat=serviceworkers](https://caniuse.com/#feat=serviceworkers)

If they are both allright, please contact me at nico@sayhello.ch

= Does it also work on iOS? =

No. At the moment, iOS does not support serviceworkers. Right now (February 2018), the support aleady in beta phase and planned for the next version of Safari. So it will only be a matter of weeks!

== Contribute ==

A development version of this plugin is hosted on GitHub. If you have any ideas for improvements, feel free to dive into the code:
[https://github.com/nico-martin/progressive-wordpress](https://github.com/nico-martin/progressive-wordpress)

== Changelog ==
= 1.1.1 =
* critical Bugfix: JavaScript error

= 1.1.0 =
* Bugfix: better way to check if files have to be regenerated
* Bugfix: PushPost not always registered
* Improvement: new manifest icon sizes

= 1.0.2 =
* Bugfix: CSS z-index for notification button

= 1.0.1 =
* Bugfix: Pushpost labels
* fixed spelling mistakes

= 1.0.0 =
* **Stable version 1.0.0**
* added multisite support
* Pushpost: send push notifications right from the post edit screen
* Added translation: de_DE
* Added translation: de_CH
* push button color input-type improvements
* add JS vars as `wp_add_inline_script`

= 0.7.0 =
* added a latest push log
* added a debug log
* using `WP_Filesystem` API instead of php `file_put_contents`
* Added "orientation" to manifest
* Added colorpicker to settings
* Fix: is_ssl() improvement

= 0.6.2 =
* Bugfix: featured image could not be changed if push notifications are enabled

= 0.6.1 =
* Bugfix: prohibit console error if sw not supported

= 0.6.0 =
* Added offline content
* select front page as offline Page
* Improvement: better hex check for manifest colors

= 0.5.1 =
* Bugfix: notification Button always visible

= 0.5.0 =
* Added push notifications!
    * let the user manage their subscription
    * manage all registered deivces
    * send push notifications to all or specific devices
* added ad status checks
* force the browser to unregister all other serviceworkers
* minor bugfixes and improvements

= 0.4.0 =
* you can now change the manifest start_url
* Bugfixes

= 0.3.0 =
* changed offline indicator
* added better instructions
* codepattern improvements

= 0.2.0 =
* added offline indicator
* Grammatical changes by [Mark Howells-Mead](https://profiles.wordpress.org/markhowellsmead/)
* "installable" is now optional
* Manifest Icon has to be png and min. 144x144px.

= 0.1.0 =
* Initial version