const axios = require('axios');

async function sendMessage(to, text) {

  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.META_TOKEN}`
      }
    }
  );
}

module.exports = sendMessage;