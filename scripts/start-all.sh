#!/bin/bash

# Start all microfrontend applications
echo "Starting Microfrontend Demo..."
echo ""
echo "Applications:"
echo "  Shell (Host):    http://localhost:3100"
echo "  React Remote:    http://localhost:3101"
echo "  Vue Remote:      http://localhost:3102"
echo "  Angular Remote:  http://localhost:3103"
echo ""

cd "$(dirname "$0")/.."
pnpm dev
