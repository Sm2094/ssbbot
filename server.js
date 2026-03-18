// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const db = require("./DB/db.js"); // your MySQL pool
const sendMessage = require("./utils/sendMessage.js");// your WhatsApp sendMessage function

const handleMenu = require("./handlers/menuHandler.js");
const handleOrder = require("./handlers/orderHandler.js");

const guidedSelling = require("./sales/guidedSelling.js");
const workflow = require("./workflow/workflowEngine.js");

const aiReply = require("./AI/aiResponder.js");

const memory = require("./memory/customerMemory.js");

const saveCustomer = require("./features/saveCustomer.js");
const notifyOwner = require("./features/notifyOwner.js");
const scheduleFollowUp = require("./features/followUpScheduler.js");

const app = express();
app.use(express.json());

// Optional health check
app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running 🚀");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "ssbbot_token";
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

// Webhook for incoming messages
app.post("/webhook", async (req, res) => {
  try {
    const changes = req.body.entry?.[0]?.changes?.[0]?.value;
    const messages = changes?.messages;

    if (!messages || messages.length === 0) return res.sendStatus(200);

    const messageObj = messages[0];
    const from = messageObj.from;

    // Safe parsing for text / buttons / lists
    const text =
      messageObj.text?.body ||
      messageObj.button?.text ||
      messageObj.list_reply?.title ||
      "";

    if (!text) return res.sendStatus(200);

    // ⚡ Limit logs so Railway doesn't crash
    if (Math.random() < 0.1) console.log("Message from:", from, "Text:", text);

    // Example: store message in DB (optional)
    db.query(
      "INSERT INTO messages (sender, message) VALUES (?, ?)",
      [from, text],
      (err) => {
        if (err) console.error("DB error:", err.message);
      }
    );

    // Reply with simple AI placeholder or static message
    await sendMessage(from, "Hello 👋 your bot is working!");

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));