const express = require("express")

const axios = require('axios');


const handleMenu = require("./handlers/menuHandler.js");
const handleOrder = require("./handlers/orderHandler.js");

const guidedSelling = require("./sales/guidedSelling.js");
const workflow = require("./workflow/workFlowEngine.js");

const aiReply = require("./AI/aiResponder.js");
const sendMessage = require("./utils/sendMessage.js");

const memory = require("./memory/customerMemory.js");

const saveCustomer = require("./features/saveCustomer.js");
const notifyOwner = require("./features/notifyOwner.js");
const scheduleFollowUp = require("./features/followUpScheduler.js");

const app = express();
app.use(express.json());

require("dotenv").config();

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "ssbbot-token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running 🚀");
});


app.post("/webhook", async (req, res) => {
  try {
    // safely access messages
    const changes = req.body.entry?.[0]?.changes?.[0]?.value;
    const messages = changes?.messages;

    if (!messages || messages.length === 0) return res.sendStatus(200);

    const messageObj = messages[0];
    const from = messageObj.from;

    // check if it's text or interactive
    const text = messageObj.text?.body || messageObj.button?.text || messageObj.list_reply?.title;

    if (!text) return res.sendStatus(200);

    console.log("Message from:", from);
    console.log("Message text:", text);

    // reply (example)
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "Hello 👋 your bot is working!" }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

app.listen(5000, () => console.log("Bot running on port 5000"));
