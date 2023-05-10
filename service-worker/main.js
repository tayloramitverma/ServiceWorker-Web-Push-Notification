let subscribeButton = document.getElementById("subscribe");
let unsubscribeButton = document.getElementById("unsubscribe");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(async function (registration) {
      console.log("Service Worker registered successfully:", registration);

      subscribeButton.addEventListener("click", function () {
        subscribeToPushNotifications(registration);
      });

      unsubscribeButton.addEventListener("click", function () {
        unsubscribeFromPushNotifications(registration);
      });
    })
    .catch(function (error) {
      console.log("Service Worker registration failed:", error);
    });
}

function subscribeToPushNotifications(registration) {
  registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BCepk22jG4yzrZumIlKpD2V3WO-xlWEIS4mBXmWsJHOEIKBQt245igbgCNUq1frK83zDMOXIwJvoi9jszwlFk_s"
      ),
    })
    .then(function (subscription) {
      console.log("Subscribed to push notifications:", subscription);
      updateSubscriptionOnServer(subscription);
      subscribeButton.disabled = true;
      unsubscribeButton.disabled = false;
    })
    .catch(function (error) {
      console.log("Failed to subscribe to push notifications:", error);
      subscribeButton.disabled = false;
      unsubscribeButton.disabled = true;
    });
}

function unsubscribeFromPushNotifications(registration) {
  registration.pushManager.getSubscription().then(function (subscription) {
    if (subscription) {
      subscription
        .unsubscribe()
        .then(function () {
          console.log("Unsubscribed from push notifications:", subscription);
          updateSubscriptionOnServer(null);
          subscribeButton.disabled = false;
          unsubscribeButton.disabled = true;
        })
        .catch(function (error) {
          console.log("Failed to unsubscribe from push notifications:", error);
          subscribeButton.disabled = true;
          unsubscribeButton.disabled = false;
        });
    }
  });
}

async function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to server for storage and use

  const SERVER_URL = "http://localhost:4000/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
