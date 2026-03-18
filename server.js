// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const db = require("./DB/db.js"); // your MySQL pool
const sendMessage = require("./utils/sendMessage.js");// your WhatsApp sendMessage function

const handleMenu = require("./handlers/menuHandler.js");
const handleOrder = require("./handlers/orderHandler.js");
const detectIntent = require("./sales/detectIntent.js");

const guidedSelling = require("./sales/guidedSelling.js");
const workflow = require("./workflow/workFlowEngine.js");

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
    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    // Ignore non-message events
    if (!value.messages) return res.sendStatus(200);

    const messages = value.messages;

    if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    // ✅ DECLARE ONCE
    const messageObj = messages[0];
    const from = messageObj.from;

    // ✅ Extract text
    const text =
      messageObj.text?.body ||
      messageObj.button?.text ||
      messageObj.list_reply?.title ||
      "";

    // Ignore empty/system messages
    if (!text || text.trim() === "") {
      return res.sendStatus(200);
    }

    let reply = null;

    // 1. Menu
    if (["hi", "hello"].includes(text.toLowerCase())) {
      reply = handleMenu(text);
    }

    // 2. Intent
    if (!reply) {
      const intent = detectIntent(text);

      if (intent === "BUY") {
        reply = "🔥 Nice choice! What product are you interested in?";
      }

      if (intent === "PRICE") {
        reply = "💰 Sure! Which product do you want the price for?";
      }
    }

    // 3. AI fallback
    if (!reply) {
      reply = await aiReply(text);
    }

    // 4. Send
    await sendMessage(from, reply);

    res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));