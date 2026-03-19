const sendMessage = require("../utils/sendMessage");

async function notifyOwner(seller, customer, message) {

    await sendMessage(
      seller.ownerPhone,
      `💰 New customer for ${seller.name}

  Customer: ${customer}
  Message: ${message}`
    );
  }

module.exports = notifyOwner;