
const axios = require("axios");
const whatWeDo = require("../bot/whatWeDo.js");

async function aiReply(message) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a sales assistant for ${whatWeDo.businessName}.
Products available: ${whatWeDo.catalog.map(p => p.name).join(", ")}
Location: ${whatWeDo.location}
Hours: ${whatWeDo.hours}

Your goal:
- Help customers buy
- Be short and persuasive
- Ask follow-up questions
- If product not available, say so politely`
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