const workflows = {
  start: {
    reply: "Welcome! Choose option:\n1️⃣ View products\n2️⃣ Best sellers",
    next: {
      "1": "view_products",
      "2": "best_sellers"
    }
  },

  view_products: {
    reply: "Products:\n1 Nike Air Max\n2 Adidas Runner",
    next: {
      "1": "order_nike",
      "2": "order_adidas"
    }
  },

  order_nike: {
    reply: "You selected Nike Air Max. Reply YES to confirm.",
    next: {
      "yes": "confirm_order"
    }
  },

  confirm_order: {
    reply: "✅ Order placed!"
  }
};

function runWorkflow(message, state) {

  const current = workflows[state || "start"];

  if (!current) return null;

  const nextNode = current.next?.[message.toLowerCase()];

  return {
    reply: current.reply,
    nextState: nextNode || state
  };
}

module.exports = runWorkflow