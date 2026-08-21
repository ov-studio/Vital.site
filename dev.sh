#!/usr/bin/env bash
# Starts backend (fixed :3001) and frontend (fixed :3000) together.
# Ctrl+C stops both.

set -e
cd "$(dirname "$0")"

echo "[dev] starting backend on :3001 ..."
(cd backend && npm run dev) &
BACKEND_PID=$!

# give backend a head start so masterlist/redis env warnings surface first
sleep 1

echo "[dev] starting frontend on :3000 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

cleanup() {
  echo ""
  echo "[dev] stopping..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

wait "$BACKEND_PID" "$FRONTEND_PID"
