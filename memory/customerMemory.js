const sessions = {};

function setSeller(phone, sellerId) {
  sessions[phone] = { sellerId };
}

function getSeller(phone) {
  return sessions[phone]?.sellerId;
}

module.exports = { setSeller, getSeller };