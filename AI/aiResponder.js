const axios = require("axios");

const whatWeDo = require("../bot/whatWeDo.js");

async function aiReply(message) {

  const catalogNames = whatWeDo.catalog
    ? whatWeDo.catalog.map(p => p.name).join(", ")
    : "No products available";

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      max_tokens: 60,
      messages: [
        {
          role: "system",
          content: `
      ${whatWeDo.aiInstructions}

        Business: ${whatWeDo.businessName}
        Products: ${catalogNames}
        Location: ${whatWeDo.location}

        SALES RULES:
        - Max 2 sentences
        - Max 25 words
        - Be direct
        - Always ask a question
        - Guide customer to buy
        - No long explanations
        - Sound like a WhatsApp human, not AI

        STYLE:
        - Friendly 😄
        - Slightly persuasive
        - Use emojis (max 1)

        GOAL:
        Turn every conversation into a sale or next step.
        `
        },
        {
          role: "user",
          content: message
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = aiReply;