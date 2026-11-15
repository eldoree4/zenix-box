#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "${IOS_BUNDLE_IDENTIFIER:-}" ]; then
  echo "[ERROR] IOS_BUNDLE_IDENTIFIER is empty. Set it in .env before building iOS."
  exit 1
fi

if [ -z "${EAS_PROJECT_ID:-}" ]; then
  echo "[WARN] EAS_PROJECT_ID empty. EAS may still configure and prompt for project creation."
fi

npx eas-cli@latest build --platform ios --profile production
