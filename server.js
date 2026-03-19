require("dotenv").config();
const express = require("express");
const sendMessage = require("./utils/sendMessage.js");

const processedMessages = new Set();

const handleMenu = require("./handlers/menuHandler.js");
const detectIntent = require("./sales/detectIntent.js");
const aiReply = require("./AI/aiResponder.js");

const { scheduleFollowUp, cancelFollowUp } = require("./features/followUpScheduler.js");

const sellers = require("./data/sellers.js");
const { setSeller, getSeller } = require("./memory/customerMemory.js");

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running 🚀");
});

// Webhook
app.post("/webhook", async (req, res) => {
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    if (!value.messages) return res.sendStatus(200);

    const messages = value.messages;
    if (!messages || messages.length === 0) {
      return res.sendStatus(200);
    }

    const messageObj = messages[0];
    const from = messageObj.from;
    const messageId = messageObj.id;

    // جلوگیری از تکرار
    if (processedMessages.has(messageId)) {
      return res.sendStatus(200);
    }

    processedMessages.add(messageId);
    setTimeout(() => processedMessages.delete(messageId), 300000);

    // Extract text
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

    // Respond fast
    res.sendStatus(200);

    const input = text.toLowerCase();

    // =========================
    // 🏪 STORE SELECTION
    // =========================
    if (!getSeller(from)) {

      // Greeting → show stores
      if (["hi", "hello"].includes(input)) {
        const storeList = Object.values(sellers)
          .map(s => `• ${s.name}`)
          .join("\n");

        return await sendMessage(
          from,
          `Welcome 👋\nChoose a store:\n${storeList}`
        );
      }

      // Try match store
      const sellerKey = Object.keys(sellers).find(key => {
        const seller = sellers[key];

        return (
          key.toLowerCase() === input ||
          seller.name.toLowerCase().includes(input)
        );
      });

      // If found → set seller
      if (sellerKey) {
        setSeller(from, sellerKey);

        return await sendMessage(
          from,
          `Welcome to ${sellers[sellerKey].name} 😎`
        );
      }

      // Not found → show stores again
      const storeList = Object.values(sellers)
        .map(s => `• ${s.name}`)
        .join("\n");

      return await sendMessage(
        from,
        `Type a store name:\n${storeList}`
      );
    }

    // =========================
    // 🤖 NORMAL BOT FLOW
    // =========================

    const sellerId = getSeller(from);
    const seller = sellers[sellerId];

    let reply = null;

    // Cancel follow-up if user replies
    cancelFollowUp(from);

    // Menu
    reply = handleMenu(text, seller);

    // Intent
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

    // AI fallback
    if (!reply) {
      reply = await aiReply(text, seller);
    }

    await sendMessage(from, reply);

  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));