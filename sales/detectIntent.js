function detectIntent(message) {
  const msg = message.toLowerCase();

  if (msg.includes("price") || msg.includes("how much")) return "PRICE";
  if (msg.includes("buy") || msg.includes("order")) return "BUY";
  if (msg.includes("location") || msg.includes("where")) return "LOCATION";
  if (msg.includes("available") || msg.includes("have")) return "AVAILABILITY";

  return "GENERAL";
}

module.exports = detectIntent;