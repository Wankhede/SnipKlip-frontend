#!/usr/bin/env bash
set -euo pipefail

BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://127.0.0.1:8081}"

check_url() {
  local name="$1"
  local url="$2"
  local expected="$3"
  local status
  status="$(curl --silent --output /dev/null --write-out '%{http_code}' "$url")"
  if [[ "$status" != "$expected" ]]; then
    echo "FAIL $name: expected $expected, got $status ($url)" >&2
    return 1
  fi
  echo "PASS $name: $status"
}

check_url "Django schema" "$BACKEND_URL/api/schema/" "200"
check_url "Next.js login" "$FRONTEND_URL/login" "200"
check_url "Next.js register" "$FRONTEND_URL/register" "200"
check_url "NextAuth providers" "$FRONTEND_URL/api/auth/providers" "200"
