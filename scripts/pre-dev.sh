#!/bin/bash

# Pre-dev script to clean up before starting development servers
# This prevents port conflicts and other common issues

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[pre-dev] Cleaning up before starting dev servers...${NC}"

# Kill any existing webpack dev server processes
echo -e "${YELLOW}[pre-dev] Killing existing webpack processes...${NC}"
pkill -f "webpack serve" 2>/dev/null || true
pkill -f "webpack-dev-server" 2>/dev/null || true

# Define ports used by microfrontends
# shell: 3100, hopefull-admin: 3101, assest-management: 3102, cmms: 3103
# family-fun: 3104, booking-guest: 3105, booking-host: 3106
# elearning-admin: 3107, elearning-student: 3108
PORTS=(3100 3101 3102 3103 3104 3105 3106 3107 3108)

# Kill processes on specific ports
echo -e "${YELLOW}[pre-dev] Freeing up ports...${NC}"
for port in "${PORTS[@]}"; do
  pid=$(lsof -ti:$port 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo -e "  Killing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null || true
  fi
done

# Small delay to ensure ports are released
sleep 1

echo -e "${GREEN}[pre-dev] Cleanup complete!${NC}"
