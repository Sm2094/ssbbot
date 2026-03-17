const whatWeDo = require("../bot/whatWeDo.js")

function handleOrder(message) {

  const product = whatWeDo.findProduct(message);

  if (!product) return null;

  return `🛒 Order detected!

Product: ${product.name}
Price: R${product.price}

Reply YES to confirm order.`;
}

module.exports = handleOrder;