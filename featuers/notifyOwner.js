const sendMessage = require("../utils/sendMessage");

const OWNER_NUMBER = "OWNER_PHONE_NUMBER";

async function notifyOwner(phone, message) {

  const text = `📢 New Customer Lead

Customer: ${phone}

Message:
${message}`;

  await sendMessage(OWNER_NUMBER, text);

}

module.exports = notifyOwner;