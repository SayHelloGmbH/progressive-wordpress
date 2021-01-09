const pushLatestPush = self.registration.scope + 'wp-content/pwp-latest-push.json';

/**
 * PUSH HANDLER
 */

self.addEventListener('push', event => {
	event.waitUntil(
		// pushManager
		registration.pushManager.getSubscription()
			.then(function (subscription) {

				// get latest data
				return fetch(pushLatestPush)
					.then(function (response) {
						return response.json()
							.then(function (data) {

								// show Notification
								return self.registration.showNotification(data.title, {
									body: data.body,
									badge: data.badge,
									icon: data.icon,
									image: data.image
								});
							})
					})
			})
	);
});

self.addEventListener('notificationclick', event => {

	const notification = event.notification;
	const action = event.action;

	if (action === 'close') {
		notification.close();
	} else {
		event.waitUntil(
			fetch(pushLatestPush)
				.then(function (response) {
					return response.json()
						.then(function (data) {
							if ('' !== data.redirect) {
								clients.openWindow(data.redirect);
							}
							notification.close();
						})
				})
				.catch(function (err) {
					notification.close();
				})
		);
	}
});