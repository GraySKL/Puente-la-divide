#!/usr/bin/env bash
# grayskl.com/puente-la-divide controlled deploy: fetch the site-live branch
# of the Puente-la-divide repo (built and staged by its GitHub Actions) and
# sync it into the folder nginx serves for the /puente-la-divide subsite.
#
# This script is run ON DEMAND only — no cron, no timers. Deploys happen
# when Sara says so. Outbound-only: the droplet fetches from GitHub;
# nothing connects inbound. Twin of site-pull.sh — the two sites deploy
# independently and never touch each other's folders.
#
# One-time setup (as the deploy user on the droplet):
#   1. sudo mkdir -p /var/www/puente-la-divide && sudo chown -R grayskl:grayskl /var/www/puente-la-divide
#   2. ssh-keygen -t ed25519 -f ~/.ssh/puente-site-deploy -N "" -C "puente-site-pull"
#   3. Add ~/.ssh/puente-site-deploy.pub as a READ-ONLY deploy key on the
#      Puente-la-divide GitHub repo (Settings -> Deploy keys -> Add deploy key).
#      (Public repo, so plain https clone works too — then skip keys and use
#      https://github.com/GraySKL/Puente-la-divide.git in step 4.)
#   4. GIT_SSH_COMMAND="ssh -i ~/.ssh/puente-site-deploy" \
#        git clone --branch site-live --single-branch \
#        git@github.com:GraySKL/Puente-la-divide.git /var/www/puente-la-divide/repo
#   5. git -C /var/www/puente-la-divide/repo config core.sshCommand "ssh -i ~/.ssh/puente-site-deploy"
#   6. Copy this script to /var/www/puente-la-divide/puente-pull.sh and chmod +x it.
#   7. Add the /puente-la-divide location block to the grayskl.com nginx
#      config (see infra/nginx-grayskl.com-snippet.conf in this repo) and
#      reload nginx. If nginx runs in a container that only mounts
#      /var/www/grayskl-com, also mount /var/www/puente-la-divide.

set -euo pipefail

REPO=/var/www/puente-la-divide/repo
LIVE=/var/www/puente-la-divide/current
LOG=/var/www/puente-la-divide/deploy.log

cd "$REPO"
git fetch --quiet origin site-live

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/site-live)
if [ "$LOCAL" = "$REMOTE" ]; then
  echo "already up to date (${LOCAL})"
  exit 0
fi

git reset --hard origin/site-live --quiet
rsync -a --delete --exclude='.git' "$REPO"/ "$LIVE"/
echo "$(date -Is) deployed ${REMOTE}" >> "$LOG"
echo "deployed ${REMOTE}"
