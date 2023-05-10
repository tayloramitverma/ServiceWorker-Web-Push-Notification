const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4000;

app.get("/", (req, res) => res.send("Hello World!"));

const dummyDb = { subscription: null };

const saveToDatabase = async (subscription) => {
  dummyDb.subscription = subscription;
};

// The new /save-subscription endpoint
app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;

  console.log("subscription", subscription);

  await saveToDatabase(subscription);
  res.json({ message: "success" });
});

const vapidKeys = {
  publicKey:
    "BCepk22jG4yzrZumIlKpD2V3WO-xlWEIS4mBXmWsJHOEIKBQt245igbgCNUq1frK83zDMOXIwJvoi9jszwlFk_s",
  privateKey: "QTlLzB7BYEdQ6l6Xkry2zfyQQz3kc6X5XF2XvK_0-mo",
};

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  "mailto:amitverma@neosoft@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend);
};

//route to test send notification
app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
