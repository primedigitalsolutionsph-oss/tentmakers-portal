#!/usr/bin/env bash
# One-shot VPS provisioning (Ubuntu 24.04, run as root).
#   curl -fsSL <raw-url-to-this-file> -o setup-vps.sh && bash setup-vps.sh
# After this: clone the repo, copy deploy/vps.env to .env.local, build, start.
set -euo pipefail

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx mysql-client
npm i -g pm2
ufw allow OpenSSH,80,443/tcp
ufw --force enable || true

node --version   # expect v22.x
nginx -v
pm2 --version
echo 'OK: base packages installed. Next: git clone, .env.local, npm run build, pm2 start.'
