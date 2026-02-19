# LoanBazaar – VPS Deployment Guide

This guide covers deploying the LoanBazaar app (Next.js frontend + Express backend) on a VPS with the domain **loanbaazaar.com**.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [VPS Setup](#2-vps-setup)
3. [Domain & DNS](#3-domain--dns)
4. [Install Dependencies](#4-install-dependencies)
5. [Backend Deployment](#5-backend-deployment)
6. [Frontend Deployment](#6-frontend-deployment)
7. [Nginx Reverse Proxy & SSL](#7-nginx-reverse-proxy--ssl)
8. [Process Management (PM2)](#8-process-management-pm2)
9. [Environment Variables Summary](#9-environment-variables-summary)
10. [Post-Deploy Checklist](#10-post-deploy-checklist)
11. [Updates & Maintenance](#11-updates--maintenance)

---

## 1. Prerequisites

- A VPS (Ubuntu 22.04 LTS recommended) with at least **1 GB RAM** and **1 vCPU**
- Root or sudo access
- Domain **loanbaazaar.com** pointed to your VPS (see [Domain & DNS](#3-domain--dns))
- Google OAuth credentials configured for production (see [Backend Deployment](#5-backend-deployment))

---

## 2. VPS Setup

### 2.1 Initial server access

```bash
ssh root@YOUR_VPS_IP
# Or: ssh your_user@YOUR_VPS_IP
```

### 2.2 Create a deploy user (optional but recommended)

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2.3 Update system and install basics

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

---

## 3. Domain & DNS

1. In your domain registrar (where you bought **loanbaazaar.com**), open DNS settings.
2. Add these records (replace `YOUR_VPS_IP` with your server’s public IP):

   | Type | Name  | Value        | TTL  |
   |------|--------|--------------|------|
   | A    | @      | YOUR_VPS_IP  | 3600 |
   | A    | www    | YOUR_VPS_IP  | 3600 |

3. Wait for DNS to propagate (5–60 minutes). Check with:

   ```bash
   dig loanbaazaar.com +short
   dig www.loanbaazaar.com +short
   ```

---

## 4. Install Dependencies

### 4.1 Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
npm -v
```

### 4.2 Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4.3 PM2 (process manager)

```bash
sudo npm install -g pm2
```

### 4.4 Certbot (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 5. Backend Deployment

### 5.1 Clone repo and install

```bash
cd /var/www  # or your preferred path
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone https://github.com/YOUR_ORG/loanbazaar.git
cd loanbazaar/backend
npm install --production
```

### 5.2 Backend environment file

Create `/var/www/loanbazaar/backend/.env`:

```env
PORT=6000
NODE_ENV=production

# MongoDB (use your existing Atlas URI or a production DB)
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/loan-bazaar?retryWrites=true&w=majority

# Google OAuth – use production credentials and add authorized redirect URIs:
# https://loanbaazaar.com/api/auth/google/callback (if you use backend callback)
# And in Google Console: Authorized JavaScript origins: https://loanbaazaar.com, https://www.loanbaazaar.com
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret

# Strong random secret (generate with: openssl rand -hex 32)
SESSION_SECRET=your-long-random-session-secret

# Production frontend URL (no trailing slash)
FRONTEND_URL=https://loanbaazaar.com

# Admin emails (comma-separated)
ADMIN_EMAILS=neerajkushwaha0401@gmail.com,workwithneeraj.01@gmail.com,shashichanyal@gmail.com
```

**Important:** In `backend/server.js`, add your production domain to CORS. Ensure the `corsOptions.origin` array includes:

- `https://loanbaazaar.com`
- `https://www.loanbaazaar.com`

Then start the backend with PM2 (see [Section 8](#8-process-management-pm2)).

---

## 6. Frontend Deployment

### 6.1 Install and build

```bash
cd /var/www/loanbazaar/frontend
npm install
```

Create `/var/www/loanbazaar/frontend/.env.production` (or set env vars before `npm run build`):

```env
# Backend API base URL (no /api suffix – the app adds it)
NEXT_PUBLIC_API_URL=https://api.loanbaazaar.com/api

# Or if you serve API on same domain under /api (see Nginx section):
# NEXT_PUBLIC_API_URL=https://loanbaazaar.com/api

# Public site URL (for emails, links)
NEXT_PUBLIC_BASE_URL=https://loanbaazaar.com
```

If you use a separate API subdomain (e.g. `api.loanbaazaar.com`), add an A record for `api` pointing to the same VPS IP.

Build the frontend:

```bash
npm run build
```

### 6.2 Frontend middleware (CORS)

In `frontend/src/middleware.ts`, add production origins so API routes allow the domain:

- `https://loanbaazaar.com`
- `https://www.loanbaazaar.com`

Then rebuild: `npm run build`.

---

## 7. Nginx Reverse Proxy & SSL

Two common setups:

- **Option A:** One domain: `loanbaazaar.com` → frontend; `loanbaazaar.com/api` → backend (proxy to `localhost:6000`).
- **Option B:** Subdomain: `loanbaazaar.com` → frontend; `api.loanbaazaar.com` → backend.

Below is **Option A** (single domain). For Option B, add a separate `server` block for `api.loanbaazaar.com` proxying to `http://127.0.0.1:6000`.

### 7.1 Nginx config for loanbaazaar.com

Create:

```bash
sudo nano /etc/nginx/sites-available/loanbaazaar.com
```

Paste (adjust paths if you used a different deploy path):

```nginx
# Redirect www to non-www
server {
    listen 80;
    listen [::]:80;
    server_name www.loanbaazaar.com;
    return 301 https://loanbaazaar.com$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name loanbaazaar.com;

    # Let Certbot create SSL config
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name loanbaazaar.com;

    # SSL – Certbot will fill these in
    # ssl_certificate /etc/letsencrypt/live/loanbaazaar.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/loanbaazaar.com/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend (Next.js on port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express on port 6000)
    location /api/ {
        proxy_pass http://127.0.0.1:6000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Cookie $http_cookie;
    }

    # Backend uploads (if you serve /uploads from Express)
    location /uploads/ {
        proxy_pass http://127.0.0.1:6000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/loanbaazaar.com /etc/nginx/sites-enabled/
# Remove default if it conflicts
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 7.2 Obtain SSL certificate

```bash
sudo certbot --nginx -d loanbaazaar.com -d www.loanbaazaar.com
```

Follow prompts. Certbot will update the Nginx config with `ssl_certificate` and `ssl_certificate_key`. Reload Nginx if needed:

```bash
sudo systemctl reload nginx
```

### 7.3 Auto-renewal

```bash
sudo certbot renew --dry-run
```

Ensure a cron or systemd timer for `certbot renew` is in place (usually installed by the certbot package).

---

## 8. Process Management (PM2)

### 8.1 Start backend and frontend

```bash
# Backend
cd /var/www/loanbazaar/backend
pm2 start server.js --name loanbazaar-api

# Frontend (from built app)
cd /var/www/loanbazaar/frontend
pm2 start npm --name loanbazaar-web -- start
```

### 8.2 Save PM2 process list and startup script

```bash
pm2 save
pm2 startup
# Run the command it prints (e.g. sudo env PATH=... pm2 startup systemd -u deploy --no-daemon)
```

### 8.3 Useful PM2 commands

```bash
pm2 list
pm2 logs loanbazaar-api
pm2 logs loanbazaar-web
pm2 restart loanbazaar-api
pm2 restart loanbazaar-web
```

---

## 9. Environment Variables Summary

| Location | Variable | Example / Note |
|----------|----------|----------------|
| **Backend** `.env` | `PORT` | `6000` |
| | `NODE_ENV` | `production` |
| | `MONGO_URI` | MongoDB Atlas URI |
| | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Production OAuth credentials |
| | `SESSION_SECRET` | Long random string |
| | `FRONTEND_URL` | `https://loanbaazaar.com` |
| | `ADMIN_EMAILS` | Comma-separated emails |
| **Frontend** `.env.production` | `NEXT_PUBLIC_API_URL` | `https://loanbaazaar.com/api` (if API under same domain) |
| | `NEXT_PUBLIC_BASE_URL` | `https://loanbaazaar.com` |

---

## 10. Post-Deploy Checklist

- [ ] DNS: `loanbaazaar.com` and `www.loanbaazaar.com` resolve to VPS IP.
- [ ] HTTPS works and www redirects to non-www.
- [ ] Homepage loads: https://loanbaazaar.com
- [ ] API health: https://loanbaazaar.com/api/health returns OK.
- [ ] Google OAuth: Authorized origins and redirect URIs in Google Console include `https://loanbaazaar.com` (and www if used).
- [ ] Backend CORS and frontend middleware include `https://loanbaazaar.com` and `https://www.loanbaazaar.com`.
- [ ] Admin login and core flows (applications, gallery, etc.) work.
- [ ] MongoDB Atlas: VPS IP allowed in Network Access (or use 0.0.0.0/0 for simplicity; prefer IP whitelist in production).

---

## 11. Updates & Maintenance

### Deploy new code

```bash
cd /var/www/loanbazaar
git pull origin main

# Backend
cd backend && npm install --production && pm2 restart loanbazaar-api

# Frontend
cd ../frontend && npm install && npm run build && pm2 restart loanbazaar-web
```

### Logs and debugging

```bash
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Firewall (optional)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Quick reference

- **Domain:** https://loanbaazaar.com  
- **Backend:** `http://127.0.0.1:6000` (proxied via Nginx)  
- **Frontend:** `http://127.0.0.1:3000` (Next.js, proxied via Nginx)  
- **SSL:** Let’s Encrypt via Certbot  
- **Process manager:** PM2  

If you use a separate API subdomain (e.g. `api.loanbaazaar.com`), set `NEXT_PUBLIC_API_URL=https://api.loanbaazaar.com/api` and add an Nginx `server` block for `api.loanbaazaar.com` proxying to `http://127.0.0.1:6000`.
