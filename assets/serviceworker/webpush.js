self.addEventListener('push', (event) => {
  const payload = JSON.parse(event.data.text());
  console.log(payload);
  console.table(payload);
  self.registration.showNotification(payload.title, {
    body: payload.body, // content of the push notification
    badge: './assets/static/logos/er-favicon.png',
    icon: './assets/static/logos/er-favicon.png',
  });
});

// listen to a notification click
/*
self.addEventListener('notificationclick', (event) => {
  self.clients.openWindow('/');
  const notification = event.notification;
  const url = notification.data.url; // get the url passed from the app
  const eventWaitUntilFullfilled = self.clients.matchAll().then((clients) => {
    let windowToFocus = false;
    clients.forEach((windowClient) => {
      if (windowClient.url === url) {
        windowClient.focus(); // focus if url match
        windowToFocus = windowClient;
      }
    });
    if (!windowToFocus) {
      self.clients
        .openWindow(url)
        .then((windowClient) => (windowClient ? windowClient.focus() : null));
    }
    notification.close();
    return sendNotificationDoneMessage(notification);
  });
  event.waitUntil(eventWaitUntilFullfilled);
});

// listen to the notification close
self.addEventListener('notificationclose', (event) => {
  event.waitUntil(sendNotificationDoneMessage(event.notification, 'closed'));
});
*/

/*

const pushLatestPush =
  self.registration.scope + 'wp-content/pwp-latest-push.json';

self.addEventListener('push', (event) => {
  event.waitUntil(
    // pushManager
    registration.pushManager.getSubscription().then(function (subscription) {
      // get latest data
      return fetch(pushLatestPush).then(function (response) {
        return response.json().then(function (data) {
          // show Notification
          return self.registration.showNotification(data.title, {
            body: data.body,
            badge: data.badge,
            icon: data.icon,
            image: data.image,
          });
        });
      });
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    event.waitUntil(
      fetch(pushLatestPush)
        .then(function (response) {
          return response.json().then(function (data) {
            if ('' !== data.redirect) {
              clients.openWindow(data.redirect);
            }
            notification.close();
          });
        })
        .catch(function (err) {
          notification.close();
        })
    );
  }
});
*/
