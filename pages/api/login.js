import db from '../../lib/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from './auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end(`
    <html>
      <head><title>Unauthorized</title></head>
      <body>
        <h1>401 - Unauthorized</h1>
        <p>Reason: Invalid credentials</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);

  const { username, password } = req.body;
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'none';
  const now = new Date().toISOString();
 

  
  if(!username || !password) {
    console.log(`timestamp=${now}|action=auth|state=FAIL|username=${username}|IP=${ip}|reason=NOUSERORPASS`)
    return res.status(401).setHeader('Content-Type', 'text/html').end(`
      <html>
        <head><title>Unauthorized</title></head>
        <body>
          <h1>401 - Unauthorized</h1>
          <p>Reason: Invalid credentials</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);    
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    console.log(`timestamp=${now}|action=auth|state=FAIL|username=${username}|IP=${ip}|reason=NOEXIST`)
    return res.status(401).setHeader('Content-Type', 'text/html').end(`
      <html>
        <head><title>Unauthorized</title></head>
        <body>
          <h1>401 - Unauthorized</h1>
          <p>Reason: Invalid credentials</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log(`timestamp=${now}|action=auth|state=FAILED|username=${username}|IP=${ip}|reason=BADPASS`)
    return res.status(401).setHeader('Content-Type', 'text/html').end(`
      <html>
        <head><title>Unauthorized</title></head>
        <body>
          <h1>401 - Unauthorized</h1>
          <p>Reason: Invalid credentials</p>
          <a href="/">Back to Home</a>
        </body>
      </html>
    `);
  }

  const token = generateToken(user);

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);
  console.log(`timestamp=${now}|action=auth|state=SUCCESS|username=${username}|IP=${ip}|token=${token}`)
  res.writeHead(302, { Location: '/profile' });
  res.end();
}
