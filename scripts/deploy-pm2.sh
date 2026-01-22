#!/bin/bash

# ============================================================
# Microfrontend Deployment Script (PM2 + Node.js - No Docker)
# Target: VMware HONGHOANG-DEMO.saigontechnology
# Server: demo (10.30.10.18)
# ============================================================

set -e

# Configuration
SERVER_IP="10.30.10.18"
SERVER_USER="${SERVER_USER:-honghoang}"
PROJECT_NAME="microfrontend"
REMOTE_DIR="\$HOME/${PROJECT_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1" >&2; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" >&2; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" >&2; }
print_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# NVM loader script - this gets prepended to all remote commands
NVM_LOADER='
# Load nvm if installed
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Also check common paths
export PATH="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -1)/bin:$PATH" 2>/dev/null || true
export PATH="$HOME/bin:$HOME/.local/bin:$PATH"
'

# Check requirements
check_requirements() {
    print_status "Checking local requirements..."

    if ! command -v ssh &> /dev/null; then
        print_error "SSH is not installed"
        exit 1
    fi

    if ! command -v rsync &> /dev/null; then
        print_warning "rsync not found, will use scp instead"
    fi

    print_success "Local requirements met"
}

# Test SSH connection
test_connection() {
    print_status "Testing SSH connection to ${SERVER_USER}@${SERVER_IP}..."

    if ssh -o ConnectTimeout=10 -o BatchMode=yes "${SERVER_USER}@${SERVER_IP}" "echo 'OK'" &> /dev/null; then
        print_success "SSH connection established"
    else
        print_warning "SSH key not configured. You'll be prompted for password."
    fi
}

# Check server requirements
check_server() {
    print_status "Checking server requirements..."

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}

MISSING=""

if ! command -v node &> /dev/null; then
    MISSING="\$MISSING node"
else
    echo "Node.js: \$(node --version)"
fi

if ! command -v npm &> /dev/null; then
    MISSING="\$MISSING npm"
else
    echo "npm: \$(npm --version)"
fi

if ! command -v pm2 &> /dev/null; then
    MISSING="\$MISSING pm2"
else
    echo "PM2: \$(pm2 --version)"
fi

if ! command -v pnpm &> /dev/null; then
    # pnpm is optional, we can use npm instead
    echo "pnpm: not found (will use npm)"
else
    echo "pnpm: \$(pnpm --version)"
fi

if [ -n "\$MISSING" ]; then
    echo ""
    echo "ERROR: Missing required tools:\$MISSING"
    echo ""
    echo "Please install Node.js using nvm (no sudo required):"
    echo ""
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "  source ~/.bashrc"
    echo "  nvm install 18"
    echo "  npm install -g pm2"
    echo ""
    exit 1
fi

echo ""
echo "All server requirements met!"
ENDSSH

    print_success "Server is ready"
}

# Build locally
build_local() {
    print_status "Building project locally..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        pnpm install
    fi

    # Build all apps with production config
    print_status "Building all apps for production..."
    export REMOTE_HOST="http://${SERVER_IP}"

    # Build each app
    for app in shell react-remote vue-remote angular-remote hopefull-admin; do
        print_status "Building ${app}..."
        cd "apps/${app}"
        if [ -f "webpack.config.prod.js" ]; then
            npx webpack --config webpack.config.prod.js
        else
            npm run build
        fi
        cd "$PROJECT_ROOT"
    done

    print_success "Build completed"
}

# Create deployment package
create_package() {
    print_status "Creating deployment package..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    TEMP_DIR=$(mktemp -d)
    DEPLOY_ARCHIVE="$TEMP_DIR/deploy.tar.gz"

    # Include dist folders and necessary files
    tar -czf "$DEPLOY_ARCHIVE" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        apps/shell/dist \
        apps/react-remote/dist \
        apps/vue-remote/dist \
        apps/angular-remote/dist \
        apps/hopefull-admin/dist \
        apps/shell/package.json \
        apps/react-remote/package.json \
        apps/vue-remote/package.json \
        apps/angular-remote/package.json \
        apps/hopefull-admin/package.json \
        ecosystem.config.js \
        package.json

    print_success "Package created"
    echo "$DEPLOY_ARCHIVE"
}

# Deploy to server
deploy() {
    print_status "Deploying to ${SERVER_IP}..."

    ARCHIVE_PATH=$(create_package)

    # Create remote directory
    ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p ~/microfrontend"

    # Upload files
    print_status "Uploading files..."
    scp "$ARCHIVE_PATH" "${SERVER_USER}@${SERVER_IP}:~/microfrontend/deploy.tar.gz"

    # Extract and start on server
    print_status "Starting services..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}

cd ~/microfrontend

# Stop existing PM2 processes
pm2 delete all 2>/dev/null || true

# Backup old dist folders
for app in shell react-remote vue-remote angular-remote hopefull-admin; do
    if [ -d "apps/\${app}/dist" ]; then
        rm -rf "apps/\${app}/dist.backup" 2>/dev/null || true
        mv "apps/\${app}/dist" "apps/\${app}/dist.backup" 2>/dev/null || true
    fi
done

# Extract new files
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Install serve package for each app
for app in shell react-remote vue-remote angular-remote hopefull-admin; do
    cd ~/microfrontend/apps/\${app}
    npm install serve --save-dev 2>/dev/null || true
done

cd ~/microfrontend

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Show status
echo ""
echo "=== PM2 Status ==="
pm2 list

echo ""
echo "=== Checking ports ==="
for port in 3100 3101 3102 3103 3105; do
    if netstat -tuln 2>/dev/null | grep -q ":\${port} " || ss -tuln 2>/dev/null | grep -q ":\${port} "; then
        echo "Port \${port}: OK"
    else
        echo "Port \${port}: NOT LISTENING (may take a moment to start)"
    fi
done
ENDSSH

    # Cleanup
    rm -rf "$(dirname "$ARCHIVE_PATH")"

    print_success "Deployment completed!"
}

# Full deploy (build + deploy)
full_deploy() {
    check_requirements
    test_connection
    check_server
    build_local
    deploy

    echo ""
    print_success "Deployment successful!"
    echo ""
    echo "Access your application at:"
    echo "  Shell (Main):     http://${SERVER_IP}:3100"
    echo "  React Remote:     http://${SERVER_IP}:3101"
    echo "  Vue Remote:       http://${SERVER_IP}:3102"
    echo "  Angular Remote:   http://${SERVER_IP}:3103"
    echo "  Hopefull Admin:   http://${SERVER_IP}:3105"
    echo ""
    echo "To enable port 80 access, run: $0 setup-nginx"
}

# Show status
status() {
    print_status "Checking status on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}

echo "=== PM2 Status ==="
pm2 list 2>/dev/null || echo "PM2 not running"

echo ""
echo "=== Port Status ==="
for port in 3100 3101 3102 3103 3105; do
    if netstat -tuln 2>/dev/null | grep -q ":\${port} " || ss -tuln 2>/dev/null | grep -q ":\${port} "; then
        echo "Port \${port}: LISTENING"
    else
        echo "Port \${port}: NOT LISTENING"
    fi
done
ENDSSH
}

# Stop services
stop() {
    print_status "Stopping services..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}
pm2 stop all 2>/dev/null || true
ENDSSH
    print_success "Services stopped"
}

# Start services
start() {
    print_status "Starting services..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}
cd ~/microfrontend && pm2 start ecosystem.config.js
ENDSSH
    print_success "Services started"
}

# Restart services
restart() {
    print_status "Restarting services..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}
pm2 restart all
ENDSSH
    print_success "Services restarted"
}

# View logs
logs() {
    print_status "Streaming logs..."
    ssh -t "${SERVER_USER}@${SERVER_IP}" "bash -c 'source ~/.nvm/nvm.sh 2>/dev/null; pm2 logs'"
}

# Usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy      - Build locally and deploy to server (default)"
    echo "  status      - Check service status"
    echo "  start       - Start services"
    echo "  stop        - Stop services"
    echo "  restart     - Restart services"
    echo "  logs        - View PM2 logs"
    echo "  setup       - Show server setup instructions"
    echo "  setup-nginx - Setup Nginx reverse proxy (port 80 -> 3100)"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 setup-nginx"
    echo "  $0 status"
}

# Server setup instructions
setup_instructions() {
    echo "============================================"
    echo "Server Setup Instructions (NO sudo required)"
    echo "============================================"
    echo ""
    echo "1. Install nvm and Node.js 18:"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "   source ~/.bashrc"
    echo "   nvm install 18"
    echo ""
    echo "2. Install PM2 globally:"
    echo "   npm install -g pm2"
    echo ""
    echo "3. (Optional) Install pnpm:"
    echo "   npm install -g pnpm"
    echo ""
    echo "4. (Optional) Setup PM2 to start on boot (requires sudo):"
    echo "   pm2 startup"
    echo "   # Follow the instructions it outputs"
    echo ""
    echo "5. Setup Nginx reverse proxy (requires sudo):"
    echo "   $0 setup-nginx"
    echo ""
}

# Setup Nginx as reverse proxy (requires sudo)
setup_nginx() {
    print_status "Setting up Nginx reverse proxy on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << 'ENDSSH'
# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "ERROR: Nginx is not installed. Install it first:"
    echo "  sudo apt update && sudo apt install -y nginx"
    exit 1
fi

# Create nginx config
NGINX_CONF="/tmp/microfrontend.conf"
cat > "$NGINX_CONF" << 'NGINX_EOF'
# Microfrontend Platform - Nginx Reverse Proxy Configuration

# Shell (Main App) - port 80 -> 3100
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
    }
}

# React Remote - port 3101
server {
    listen 3101;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3101;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}

# Vue Remote - port 3102
server {
    listen 3102;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3102;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}

# Angular Remote - port 3103
server {
    listen 3103;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3103;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}

# Hopefull Admin - port 3105
server {
    listen 3105;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3105;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }
}
NGINX_EOF

echo ""
echo "Nginx config created at: $NGINX_CONF"
echo ""
echo "To install, run these commands with sudo:"
echo "  sudo cp $NGINX_CONF /etc/nginx/sites-available/microfrontend"
echo "  sudo ln -sf /etc/nginx/sites-available/microfrontend /etc/nginx/sites-enabled/"
echo "  sudo rm -f /etc/nginx/sites-enabled/default"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo ""
ENDSSH

    print_success "Nginx config template created on server"
    echo ""
    echo "Now SSH to server and run:"
    echo "  sudo cp /tmp/microfrontend.conf /etc/nginx/sites-available/microfrontend"
    echo "  sudo ln -sf /etc/nginx/sites-available/microfrontend /etc/nginx/sites-enabled/"
    echo "  sudo rm -f /etc/nginx/sites-enabled/default"
    echo "  sudo nginx -t && sudo systemctl reload nginx"
}

# Main
main() {
    case "${1:-deploy}" in
        deploy)
            full_deploy
            ;;
        status)
            status
            ;;
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        logs)
            logs
            ;;
        setup)
            setup_instructions
            ;;
        setup-nginx)
            setup_nginx
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            print_error "Unknown command: $1"
            usage
            exit 1
            ;;
    esac
}

main "$@"
