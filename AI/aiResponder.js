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
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content: `
${whatWeDo.aiInstructions}

Business: ${whatWeDo.businessName}
Products: ${catalogNames}
Location: ${whatWeDo.location}
Hours: ${whatWeDo.hours}
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