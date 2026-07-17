# LoanBazaar – Next.js Fullstack Deployment Guide

This guide covers deploying LoanBazaar as a self-contained Next.js application (no separate Express backend).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [VPS Setup](#2-vps-setup)
3. [Domain & DNS](#3-domain--dns)
4. [Install Dependencies](#4-install-dependencies)
5. [Application Deployment](#5-application-deployment)
6. [Nginx Reverse Proxy & SSL](#6-nginx-reverse-proxy--ssl)
7. [Process Management (PM2)](#7-process-management-pm2)
8. [Environment Variables](#8-environment-variables)
9. [Post-Deploy Checklist](#9-post-deploy-checklist)
10. [Updates & Maintenance](#10-updates--maintenance)

---

## 1. Prerequisites

- A VPS (Ubuntu 22.04 LTS recommended) with at least **1 GB RAM** and **1 vCPU**
- Root or sudo access
- Domain **loanbaazaar.com** pointed to your VPS
- Google OAuth credentials configured with authorized redirect URIs

---

## 2. VPS Setup

### 2.1 Initial server access

```bash
ssh root@YOUR_VPS_IP
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

Add these DNS records (replace `YOUR_VPS_IP`):

| Type | Name | Value       | TTL  |
|------|------|-------------|------|
| A    | @    | YOUR_VPS_IP | 3600 |
| A    | www  | YOUR_VPS_IP | 3600 |

Verify propagation:

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

## 5. Application Deployment

### 5.1 Clone and install

```bash
cd /var/www
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www

git clone https://github.com/YOUR_ORG/loanbazaar.git
cd loanbazaar/frontend
npm install
```

### 5.2 Environment file

Create `/var/www/loanbazaar/frontend/.env.production`:

```env
NEXTAUTH_URL=https://loanbaazaar.com
NEXTAUTH_SECRET=your-long-random-secret
NEXT_PUBLIC_BASE_URL=https://loanbaazaar.com

MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/loanbaazaar?retryWrites=true&w=majority

GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

### 5.3 Google OAuth callback configuration

In Google Cloud Console, add authorized redirect URIs:

```
https://loanbaazaar.com/api/auth/callback/google
https://www.loanbaazaar.com/api/auth/callback/google
```

### 5.4 Build

```bash
npm run build
```

---

## 6. Nginx Reverse Proxy & SSL

### 6.1 Create Nginx config

```bash
sudo nano /etc/nginx/sites-available/loanbaazaar.com
```

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

    # SSL – Certbot fills these in
    # ssl_certificate /etc/letsencrypt/live/loanbaazaar.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/loanbaazaar.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.2 Enable and test

```bash
sudo ln -s /etc/nginx/sites-available/loanbaazaar.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 Obtain SSL certificate

```bash
sudo certbot --nginx -d loanbaazaar.com -d www.loanbaazaar.com
```

Follow prompts. Certbot updates the Nginx config automatically.

### 6.4 Auto-renewal

```bash
sudo certbot renew --dry-run
```

---

## 7. Process Management (PM2)

### 7.1 Start the app

```bash
cd /var/www/loanbazaar/frontend
pm2 start npm --name loanbazaar -- start
```

### 7.2 Save and enable startup

```bash
pm2 save
pm2 startup
# Run the command it prints
```

### 7.3 Useful PM2 commands

```bash
pm2 list
pm2 logs loanbazaar
pm2 restart loanbazaar
pm2 stop loanbazaar
```

---

## 8. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_URL` | Yes | Canonical URL (e.g. `https://loanbaazaar.com`) |
| `NEXTAUTH_SECRET` | Yes | Random string for JWT signing |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL for email links |

---

## 9. Post-Deploy Checklist

- [ ] DNS resolves correctly
- [ ] HTTPS works, www redirects to non-www
- [ ] Homepage loads: https://loanbaazaar.com
- [ ] Admin sign-in with Google OAuth works
- [ ] Application submission works (loan, insurance, consultancy)
- [ ] Gallery page loads with images
- [ ] MongoDB Atlas: VPS IP whitelisted in Network Access
- [ ] Google OAuth: Authorized redirect URIs include production domains

---

## 10. Updates & Maintenance

### Deploy new code

```bash
cd /var/www/loanbazaar
git pull origin main
cd frontend
npm install
npm run build
pm2 restart loanbazaar
```

### Logs and debugging

```bash
pm2 logs loanbazaar
sudo tail -f /var/log/nginx/error.log
```

### Firewall (optional)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
