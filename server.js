// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const db = require("./DB/db.js"); // your MySQL pool
const sendMessage = require("./utils/sendMessage.js");// your WhatsApp sendMessage function

const processedMessages = new Set();

const handleMenu = require("./handlers/menuHandler.js");
const handleOrder = require("./handlers/orderHandler.js");
const detectIntent = require("./sales/detectIntent.js");

const guidedSelling = require("./sales/guidedSelling.js");
const workflow = require("./workflow/workFlowEngine.js");

const aiReply = require("./AI/aiResponder.js");

const memory = require("./memory/customerMemory.js");

const saveCustomer = require("./features/saveCustomer.js");
const notifyOwner = require("./features/notifyOwner.js");
const { scheduleFollowUp, cancelFollowUp } = require("./features/followUpScheduler.js");

const app = express();
app.use(express.json());

// Optional health check
app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running 🚀");
});

// Webhook verification
  app.post("/webhook", async (req, res) => {
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;

      if (!value.messages) return res.sendStatus(200);

    const messages = value.messages;
      if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    const sellers = require("./data/sellers");
    const { setSeller, getSeller } = require("./memory/customerMemory");

// First message detection
if (!getSeller(from)) {

  const sellerKey = text.toLowerCase();

  if (sellers[sellerKey]) {
    setSeller(from, sellerKey);

    return await sendMessage(
      from,
      `Welcome to ${sellers[sellerKey].name} 😎`
    );
  }

  return await sendMessage(
    from,
    "Please enter a valid store code."
  );
}

     const messageObj = messages[0];
     const from = messageObj.from;

         const messageId = messageObj.id;

// ❌ If already processed → ignore
      if (processedMessages.has(messageId)) {
        return res.sendStatus(200);
      }

      // ✅ Mark as processed
      processedMessages.add(messageId);

      // Optional: clean memory after 5 min
      setTimeout(() => {
        processedMessages.delete(messageId);
      }, 300000);


    let text = null;

    if (messageObj.type === "text") {
      text = messageObj.text.body;
    }

    if (messageObj.type === "button") {
      text = messageObj.button.text;
    }

    if (messageObj.type === "interactive") {
      text =
        messageObj.interactive?.button_reply?.title ||
        messageObj.interactive?.list_reply?.title;
    }

    if (!text || text.trim() === "") {
      return res.sendStatus(200);
    }

    // ✅ RESPOND IMMEDIATELY (IMPORTANT)
    res.sendStatus(200);

    // 🧠 THEN process in background
    let reply = null;
    // ✅ User replied → cancel any pending follow-up
    cancelFollowUp(from);

    reply = handleMenu(text);

      if (!reply) {
      const intent = detectIntent(text);

      if (intent === "BUY") {
        reply = "🔥 Nice choice! What product are you interested in?";
        scheduleFollowUp(from, "our products");
      }

      if (intent === "PRICE") {
        reply = "💰 Sure! Which product do you want the price for?";
      }
    }

     if (!reply) {
      reply = await aiReply(text);
    }

      await sendMessage(from, reply);

    } catch (err) {
      console.error("Webhook error:", err.response?.data || err.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));