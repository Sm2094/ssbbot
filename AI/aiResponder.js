const axios = require("axios");

const whatWeDo = require("../bot/whatWeDo.js");

async function aiReply(message, seller) {

  const catalogNames = seller.catalog
    ? seller.catalog.map(p => p.name).join(", ")
    : "No products available";


  if (catalogNames === "No products available") {
  return "Let me connect you with the seller 👍";
}

  try{
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      max_tokens: 60,
      messages: [
        {
          role: "system",
          content: `
            ${whatWeDo}

          Business: ${seller.name}
          Products: ${catalogNames}
          Location: ${seller.location}

          SALES RULES:
          - Max 2 sentences
          - Max 20 words
          - Be natural, like WhatsApp chat
          - Be confident, not pushy
          - Only ask a question if needed
          - Focus on helping customer decide fast

          GOAL:
          Move customer closer to buying (not just chatting)
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


  }catch(err){
    console.error("AI Error:", err.response?.data || err.message);

    return "Sorry 😅 something went wrong. Can you try again?";
  }
}

module.exports = aiReply;