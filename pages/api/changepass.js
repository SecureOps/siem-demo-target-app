import db from '../../lib/db.js';
import bcrypt from 'bcrypt';
import { getUserFromRequest } from './auth.js';

export default async function handler(req, res) {
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'none';
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const user = getUserFromRequest(req);
  if (!user) {
    console.log(`action=passchanged|state=FAILED|username=${user.username}|IP=${ip}|reason=NOEXIST`)
    return res.writeHead(302, {
      Location: '/login',
    }).end();
  }

  const { oldpass, newpass } = req.body;

  // Fetch full user record from DB
  const record = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  if (!record) {
    console.log(`action=passchanged|state=FAILED|username=${user.username}|IP=${ip}|reason=NOEXIST`)
    return res.writeHead(302, {
      Location: '/profile?error=' + encodeURIComponent('User not found'),
    }).end();
  }

  // Compare old password
  const match = await bcrypt.compare(oldpass, record.password);
  if (!match) {
    console.log(`action=passchanged|state=FAILED|username=${user.username}|IP=${ip}|reason=BADPASS`)
    return res.writeHead(302, {
      Location: '/profile?error=' + encodeURIComponent('Old password is incorrect'),
    }).end();
  }

  // Hash and update new password
  const newHash = await bcrypt.hash(newpass, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, user.id);
  console.log(`action=passchanged|state=SUCCESS|username=${user.username}|IP=${ip}`)
  // Redirect on success
  return res.writeHead(302, {
    Location: '/profile?success=true',
  }).end();
}


