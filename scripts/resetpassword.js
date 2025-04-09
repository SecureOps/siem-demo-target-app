const fs = require('fs');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const DB_FILE = 'webapp.sqlite';

const db = new Database(DB_FILE);

const args = process.argv.slice(2); // Slice off ['node, 'script.js']

const username = args[0];
const password = args[1];

// Check if users table is empty
const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
if (user && password) {
  const hash = bcrypt.hashSync(password, 10);  
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hash, username)
  console.log(`Updated password for ${username}`)
} else {
  console.log(`User ${username} does not exist or password was not provided`);
}

module.exports = db;