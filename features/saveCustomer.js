const db = require("../DB/db.js");

function saveCustomer(phone) {

  const query = `
  INSERT INTO customers (phone, first_seen, last_seen)
  VALUES (?, NOW(), NOW())
  ON DUPLICATE KEY UPDATE last_seen = NOW()
  `;

  db.query(query, [phone], (err) => {
    if (err) console.error(err);
  });

}

module.exports = saveCustomer;