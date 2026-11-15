#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "${ANDROID_PACKAGE:-}" ]; then
  echo "[ERROR] ANDROID_PACKAGE is empty. Set it in .env before building Android."
  exit 1
fi

if [ -z "${EAS_PROJECT_ID:-}" ]; then
  echo "[WARN] EAS_PROJECT_ID empty. EAS may still configure and prompt for project creation."
fi

npx eas-cli@latest build --platform android --profile production
