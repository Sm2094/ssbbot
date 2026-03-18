const express = require("express")


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

app.post("/webhook", async (req, res) => {

  const message = req.body.entry[0].changes[0].value.messages[0].text.body;
  const from = req.body.entry[0].changes[0].value.messages[0].from;

  // Save customer lead
  saveCustomer(from);

  // Notify business owner
  notifyOwner(from, message);

  const customer = memory.getCustomer(from);

  let result;

  // Guided selling
  result = guidedSelling(message, customer.state);

  // Workflow
  if (!result) {
    result = workflow(message, customer.state);
  }

  // Menu
  if (!result) {
    const menuReply = handleMenu(message);
    if (menuReply) result = { reply: menuReply };
  }

  // Order detection
  if (!result) {
    const orderReply = handleOrder(message);
    if (orderReply) {

      // Schedule follow-up if user doesn't buy
      scheduleFollowUp(from, message);

      result = { reply: orderReply };
    }
  }

  // AI fallback
  if (!result) {
    const ai = await aiReply(message);
    result = { reply: ai };
  }

  if (result.nextState !== undefined) {
    memory.updateState(from, result.nextState);
  }

  await sendMessage(from, result.reply);

  res.sendStatus(200);

});

app.listen(5000, () => console.log("Bot running on port 5000"));
