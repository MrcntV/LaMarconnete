#!/bin/bash
cd "$(dirname "$0")"

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[auto-pull] Nouveaux commits détectés, mise à jour..."
  git pull origin main
  npm install --legacy-peer-deps
  npm run build
  pm2 restart marconnete
  echo "[auto-pull] Déploiement terminé."
else
  echo "[auto-pull] Aucun changement."
fi
