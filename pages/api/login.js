import db from '../../lib/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from './auth.js';

const cef_base='CEF:0|SecureOps|DemoAppTarget|1|0'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'none';
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    console.log(`${cef_base}|auth|warn|state=FAIL|username=${username}|IP=${ip}|reason=NOEXIST`)
    return res.writeHead(302, {
      Location: '/unauthorized?error=' + encodeURIComponent('Invalid username or password'),
    }).end();
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log(`${cef_base}|auth|warn|state=FAILED|username=${username}|IP=${ip},reason=BADPASS`)
    return res.writeHead(302, {
      Location: '/unauthorized?error=' + encodeURIComponent('Invalid username or password'),
    }).end();
  }

  const token = generateToken(user);

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
  console.log(`${cef_base}|auth|info|state=SUCCESS|username=${username}|IP=${ip}|token=${token}`)
  res.writeHead(302, { Location: '/profile' });
  res.end();
}
