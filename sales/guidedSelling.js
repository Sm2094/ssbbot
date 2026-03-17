const whatWeDo = require("../bot/whatWeDo.js");

function guidedSelling(message, state) {

  if (!state || state.step === "start") {
    return {
      reply: `🔥 Best Sellers

1️⃣ Nike Air Max – R1200
2️⃣ Adidas Runner – R950
3️⃣ Puma Flex – R850

Reply with product number.`,
      nextState: { step: "choose_product" }
    };
  }

  if (state.step === "choose_product") {

    const product = whatWeDo.catalog.find(p => p.id == message);

    if (!product) return null;

    return {
      reply: `Great choice!

${product.name} – R${product.price}

Choose size:
7️⃣
8️⃣
9️⃣`,
      nextState: {
        step: "choose_size",
        product
      }
    };
  }

  if (state.step === "choose_size") {

    return {
      reply: `Confirm order?

Product: ${state.product.name}
Size: ${message}

Reply YES to confirm.`,
      nextState: {
        step: "confirm_order",
        product: state.product,
        size: message
      }
    };
  }

  if (state.step === "confirm_order" && message.toLowerCase() === "yes") {

    return {
      reply: `✅ Order confirmed!

${state.product.name}
Size ${state.size}

Our team will contact you shortly.`,
      nextState: null
    };
  }

  return null;
}

module.exports = guidedSelling;