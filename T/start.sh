#!/bin/bash
# Start the backend API server in the background
cd "$(dirname "$0")"
PORT=8080 pnpm --filter @workspace/api-server run dev &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 3

# Start the frontend dev server
PORT="${PORT:-23945}" BASE_PATH=/ pnpm --filter @workspace/voice-biomarker-monitor run dev

# If frontend exits, kill the backend too
kill $BACKEND_PID 2>/dev/null
