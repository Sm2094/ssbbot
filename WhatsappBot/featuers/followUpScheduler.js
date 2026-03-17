const sendMessage = require("../utils/sendMessage");

const pendingFollowUps = {};

function scheduleFollowUp(phone, product) {

  const delay = 1000 * 60 * 60 * 24; // 24 hours

  pendingFollowUps[phone] = setTimeout(async () => {

    const text = `Hi 👋

You asked about ${product} yesterday.

We still have it available.
Would you like to order today?`;

    await sendMessage(phone, text);

  }, delay);

}

module.exports = scheduleFollowUp;