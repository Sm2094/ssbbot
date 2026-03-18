// whatWeDo.js
const whatWeDo = {
  businessName: "SSB Store",

  catalog: [
    { id: 1, name: "Black Hoodie", price: 350 },
    { id: 2, name: "White T-Shirt", price: 150 },
    { id: 3, name: "Sneakers", price: 800 }
  ],

  location: "Durban, South Africa",
  hours: "Mon - Sat, 9AM - 6PM",

  aiInstructions: `
You are a sales assistant.

Your job:
- Help customers understand products
- Answer questions
- Encourage buying
- Be friendly and persuasive

Rules:
- Keep replies short and natural
- Always guide toward a sale
- If you don’t know, ask a question
`
};

module.exports = whatWeDo;