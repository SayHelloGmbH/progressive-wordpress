self.addEventListener('push', (event) => {
  const payload = JSON.parse(event.data.text());
  self.registration.showNotification(payload.title, {
    body: payload.body,
    badge: payload.badge,
    icon: payload.icon,
    image: payload.image,
    data: {
      ...payload,
      origin: event.target.origin,
    },
  });
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const url = notification.data.redirect || notification.data.origin;
  const eventWaitUntilFullfilled = self.clients.matchAll().then((clients) => {
    let windowToFocus = false;
    clients.forEach((windowClient) => {
      if (windowClient.url === url) {
        windowClient.focus();
        windowToFocus = windowClient;
      }
    });

    if (!windowToFocus) {
      self.clients.openWindow(url);
    }

    return notification.close();
  });
  event.waitUntil(eventWaitUntilFullfilled);
});
