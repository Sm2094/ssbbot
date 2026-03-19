const sendMessage = require("../utils/sendMessage");

const pendingFollowUps = {};

function scheduleFollowUp(phone, product) {

  // ❌ Prevent duplicate timers
  if (pendingFollowUps[phone]) {
    clearTimeout(pendingFollowUps[phone]);
  }

  const delay = 1000 * 60 * 60; // 1 hour (use short time for testing)

  pendingFollowUps[phone] = setTimeout(async () => {

    const text = `Hey 👋 just checking in.

Are you still interested in ${product}?`;

    await sendMessage(phone, text);

    delete pendingFollowUps[phone]; // cleanup

  }, delay);
}


// ✅ Cancel if user replies
function cancelFollowUp(phone) {
  if (pendingFollowUps[phone]) {
    clearTimeout(pendingFollowUps[phone]);
    delete pendingFollowUps[phone];
  }
}

module.exports = {
  scheduleFollowUp,
  cancelFollowUp
};