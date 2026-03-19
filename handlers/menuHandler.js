function handleMenu(message, seller) {

  const msg = message.toLowerCase().trim();

  if (msg === "hi" || msg === "hello") {
    return `Welcome to ${seller.name} 👕
1️⃣ View products
2️⃣ Prices
3️⃣ Store location
4️⃣ Order product`;
  }

  if (msg === "1") {
    return seller.catalog
      .map(p => `${p.id}. ${p.name}`)
      .join("\n");
  }

  if (msg === "2") {
    return seller.catalog
      .map(p => `${p.name} – R${p.price}`)
      .join("\n");
  }

  if (msg === "3") {
    return `📍 ${seller.location}\n🕒 ${seller.hours}`;
  }

  return null;
}

module.exports = handleMenu;