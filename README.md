# Next.js + Tailwind + JWT Auth Web App (SQLite Version)

This project is a simplified version of an authenticated app using:
- **Next.js** (Pages Router)
- **Tailwind CSS** for styling
- **SQLite** (via `better-sqlite3`) for data persistence
- **JWT-based auth** with HttpOnly cookie sessions

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

SQLite dependency:
```bash
npm install better-sqlite3 jsonwebtoken cookie
```

Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Create `.env.local`

```env
JWT_SECRET=supersecurekeyforjwt
```

### 3. Run the app

```bash
npm run dev
```

SQLite DB will auto-create and seed 10 users: `user1` to `user10` with `pass1` to `pass10`.

---
---

## 🔐 Security Features Added

- Passwords are hashed using `bcrypt` (10 salt rounds).
- Secure logout route `/api/logout` clears JWT token cookie.

