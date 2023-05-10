self.addEventListener("push", function (event) {
  console.log("Received a push message", event);
  const title = "Push Notification Demo";
  const options = {
    body: event.data.text(),
    icon: "./assets/alarm.png",
    badge: "images/badge.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked", event);
  event.notification.close();
  event.waitUntil(clients.openWindow("https://www.tayloramitverma.com"));
});
