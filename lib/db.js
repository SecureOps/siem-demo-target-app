const fs = require('fs');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const DB_FILE = 'webapp.sqlite';
const CREDENTIALS_FILE = '.web-credentials';

const db = new Database(DB_FILE);

// Ensure users table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

// Check if users table is empty
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;

if (userCount === 0) {
  const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const credentials = [];

  for (let i = 1; i <= 10; i++) {
    const username = `user${i}`;
    const password = `pass${i}`;
    const hash = bcrypt.hashSync(password, 10);
    insert.run(username, hash);
    credentials.push(`${username}:${password}`);
  }

  fs.writeFileSync(CREDENTIALS_FILE, credentials.join('\n'));
  console.log('✅ Seeded DB and wrote credentials to .web-credentials');
} else {
  console.log('ℹ️ Users already exist. Skipping seeding and credentials file.');
}

module.exports = db;
