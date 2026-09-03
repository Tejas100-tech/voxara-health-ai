#!/bin/bash
cd "$(dirname "$0")"

# Freebuff injects PORT for the frontend
FRONTEND_PORT="${PORT:-23945}"

# Start backend on port 8080 (always)
PORT=8080 pnpm --filter @workspace/api-server run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 4

# Start frontend on Freebuff-injected port
PORT="$FRONTEND_PORT" BASE_PATH="/" pnpm --filter @workspace/voice-biomarker-monitor run dev &
FRONTEND_PID=$!

# Clean up both on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

wait
