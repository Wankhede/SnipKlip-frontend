#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local. Copy .env.example and generate fresh secrets." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  npm install --legacy-peer-deps
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [[ "$NODE_MAJOR" == "18" ]]; then
  exec npm run dev
fi

echo "Host Node is $(node -v); running this legacy Next.js 12 app with portable Node 18." >&2
exec npm exec --yes --package=node@18 -- node node_modules/next/dist/bin/next dev -p 8081
