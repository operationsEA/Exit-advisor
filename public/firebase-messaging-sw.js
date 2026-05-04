/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDOIY5pwHpW2eWpq2UAHjBPn6jf2CN47UA",
  authDomain: "bizforsale-6d902.firebaseapp.com",
  projectId: "bizforsale-6d902",
  storageBucket: "bizforsale-6d902.firebasestorage.app",
  messagingSenderId: "837111595220",
  appId: "1:837111595220:web:6c2cb75b506ebe26937b41",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload?.notification || {};
  const data = payload?.data || {};

  const title = notification.title || data.title || "New Notification";
  const options = {
    body: notification.body || data.body || "",
    icon: notification.icon || data.icon || "/favicon.ico",
    image: notification.image || data.image,
    data,
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }

        return undefined;
      }),
  );
});
