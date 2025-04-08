import db from '../../lib/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.writeHead(302, {
      Location: '/unauthorized?error=' + encodeURIComponent('Invalid username or password'),
    }).end();
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.writeHead(302, {
      Location: '/unauthorized?error=' + encodeURIComponent('Invalid username or password'),
    }).end();
  }

  const token = generateToken(user);

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
  res.writeHead(302, { Location: '/profile' });
  res.end();
}
