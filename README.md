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

#### These aren't necessary unless something goes wrong, it's safe to skip them
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

#### For the development environment (i.e. your laptop)
```bash
npm run dev
```

SQLite DB will auto-create and seed 10 users: `user1` to `user10` with `pass1` to `pass10`. These credentials will also be written to .web-credentials in the project's root folder.

NOTE, if you change the password, because we're using bcrypt, you can't simply reverse the password in the DB because it's hashed.

```bash
TODO: insert sqlite3 command/query to reset password here
```

### 4. Linux install (AWS Linux2)
Install node, npm, NGINX and certbot on a linux instance
```bash
sudo yum install certbot python3-certbot-nginx git nginx nodejs cronie
```

If you used the -A flag when SSH'ing to the instance, it should be able to re-use your SSH key to checkout the git repo
```bash
mkdir git && cd git;
git clone git@github.com:SecureOps/siem-demo-target-app.git
```

At this point, create a __.env.local__ file like in step 2 above.

Using certbot to generate an SSL cert (note, you need to have valid DNS in Route53, in this case we're using demotarget.msslab.redlabnet.com)
```bash
sudo certbot --nginx -d demotarget.msslab.redlabnet.com
```
You might get some errors as the certbot nginx module doesn't like this particular layout of nginx configs. There will be two paths for the
generated certs, we'll need them to modify the config below.

Next edit /etc/nginx/conf.d to create a new SSL profile
```bash
sudo vi /etc/nginx/conf.d/demoapp.conf
```
```nginx
# Settings for a TLS enabled server.
server {
    listen 80;
    server_name demotarget.msslab.redlabnet.com;
    return 301 https://$host$request_uri;
}
server {
    listen       443 ssl;
    listen       [::]:443 ssl;
    http2        on;
    server_name  demotarget.msslab.redlabnet.com;

    location /
    {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
    ssl_certificate "/etc/letsencrypt/live/demotarget.msslab.redlabnet.com/fullchain.pem";
    ssl_certificate_key "/etc/letsencrypt/live/demotarget.msslab.redlabnet.com/privkey.pem";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers PROFILE=SYSTEM;
    ssl_prefer_server_ciphers on;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /404.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}
```

Validate the nginx config
```bash
sudo nginx -t
```

Create a cron job to renew the certbot cert
```bash
sudo crontab -e -u root
```
```crontab
43 6 * * * certbot renew --renew-hook "systemctl reload nginx"
```
Confirm the crontab
```bash
sudo -l -u root
```

Build the server
```bash
sudo npm build
sudo pm2 start npm --name "DemoTargetApp" -- start
sudo pm2 startup
sudo pm2 save
```
At this point you should be have the app listening on port 3000.

You can view the NodeJS console logs
```bash
sudo pm2 logs
```

Enable NGINX
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

Configure rsyslog. 

/etc/rsyslog.d/97-in-pm2.conf
```rsyslog
# Load the modules needed
module(load="imfile")  # For reading log files


# Input file 1 configuration
input(
    type="imfile"
    File="/root/.pm2/logs/DemoTargetApp-out.log"
    Tag="demotargetapp-out:"
    Severity="info"
    Facility="local1"
)

# Input file 2 configuration
input(
    type="imfile"
    File="/root/.pm2/logs/DemoTargetApp-error.log"
    Tag="demotargetapp-error:"
    Severity="info"
    Facility="local2"
)
```
/etc/rsyslog.d/98-out-cribl.conf
```rsyslog
module(load="omfwd")   # For forwarding logs

# Define the remote syslog server and port
action(
    type="omfwd"
    Target="100.64.0.147:5514"
    Port="5514"
    Protocol="tcp"
)
```

/etc/rsyslog.d/99-rules.conf
```rsyslog
# Send both inputs to the remote syslog server
if $programname == 'demotargetapp-error' then @@100.64.0.147:5514
if $programname == 'demotargetapp-out' then @@100.64.0.147:5514
```



You should be able to go to the website now and see it.

Note, any mods to the app:
```bash
git pull
npm run build
sudo pm2 restart all
```
---
---

## 🔐 Security Features Added

- Passwords are hashed using `bcrypt` (10 salt rounds).
- Secure logout route `/api/logout` clears JWT token cookie.

