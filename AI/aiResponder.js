import axios from "axios";
import whatWeDo from "../bot/whatWeDo.js";

async function aiReply(message) {

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant for ${whatWeDo.businessName}.
Products available: ${whatWeDo.catalog.map(p => p.name).join(", ")}
Location: ${whatWeDo.location}
Hours: ${whatWeDo.hours}

If a customer asks about something not in the catalog, say we don't sell it.`
        },
        {
          role: "user",
          content: message
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer YOUR_OPENAI_KEY`
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = aiReply;