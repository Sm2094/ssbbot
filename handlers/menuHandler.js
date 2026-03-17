const whatWeDo = require("../bot/whatWeDo.js");

function handleMenu(message) {

  const msg = message.toLowerCase().trim();

  if (msg === "hi" || msg === "hello") {
    return `Welcome to ${whatWeDo.businessName} 👕
1️⃣ View products
2️⃣ Prices
3️⃣ Store location
4️⃣ Order product`;
  }

  if (msg === "1") {
    return whatWeDo.catalog
      .map(p => `${p.id}. ${p.name}`)
      .join("\n");
  }

  if (msg === "2") {
    return whatWeDo.catalog
      .map(p => `${p.name} – R${p.price}`)
      .join("\n");
  }

  if (msg === "3") {
    return `📍 ${whatWeDo.location}\n🕒 ${whatWeDo.hours}`;
  }

  return null;
}

module.exports = handleMenu;