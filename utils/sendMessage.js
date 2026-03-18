const axios = require('axios');

async function sendMessage(to, text) {

  await axios.post(
    `https://graph.facebook.com/v19.0/1083279688194277/messages`,
    {
      messaging_product: "whatsapp",
      to: "27833531131",
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer EAARZCEVQbdl8BQ9gbq7HZAiB1Temew0SaSe4LLEGKxqx04qRGGfVnBsnGGZBrkE0ZC7IMm3x3iFk5i8IEg7ZCIlum5ONUg0XlVA8sWgq36mYbQZBjk7ZCvGB9SLcG0ogR5bwyjDt6RWxjuIAUwLGbDTkZCPIkYE7d3rb61xuh4HiLGYnf7aWUHYL1VTNyUZAU1UcXJq2Fjsx6YCBCRchRfnAl3xTwfeAIWZBTq2Gd7ZBX0Tb9p6fAmPx7AhbHCtsE3G2nNesSLQvExOxdJoTkc31SLjfAs1`
      }
    }
  );
}

module.exports = sendMessage;