import mysql from 'mysql2'

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0660@Sphe",
  database: "whatsappbot"
});

module.exports = db;