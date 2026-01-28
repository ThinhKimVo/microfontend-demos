#!/bin/bash

# ============================================================
# Microfrontend Deployment Script (PM2 + Docker PostgreSQL)
# Target: VMware HONGHOANG-DEMO.saigontechnology
# Server: demo (10.30.10.18)
#
# Services:
#   - PostgreSQL: Docker container (port 5432)
#   - Shell API:  Express server via PM2 (port 3150)
#   - Frontend:   Static servers via PM2 (ports 3100-3108)
# ============================================================

set -e

# Configuration
SERVER_IP="10.30.10.18"
SERVER_USER="${SERVER_USER:-honghoang}"
PROJECT_NAME="microfrontend"
REMOTE_DIR="\$HOME/${PROJECT_NAME}"

# App configuration using functions (bash 3.x compatible)
get_app_config() {
    local app_name="$1"
    case "$app_name" in
        shell)              echo "apps/shell:3100:mfe-shell" ;;
        shell-api)          echo "apps/shell/server:3150:mfe-shell-api" ;;
        hopefull-admin)     echo "apps/hopefull-admin:3101:mfe-hopefull-admin" ;;
        assest-management)  echo "apps/assest-management:3102:mfe-assest-management" ;;
        cmms)               echo "apps/cmms:3103:mfe-cmms" ;;
        family-fun)         echo "apps/FamilyFun/frontend:3104:mfe-family-fun" ;;
        booking-guest)      echo "apps/BookingSystem/packages/guest-portal:3105:mfe-booking-guest" ;;
        booking-host)       echo "apps/BookingSystem/packages/host-portal:3106:mfe-booking-host" ;;
        elearning-admin)    echo "apps/elearning/admin-portal:3107:mfe-elearning-admin" ;;
        elearning-student)  echo "apps/elearning/student-portal:3108:mfe-elearning-student" ;;
        *)                  echo "" ;;
    esac
}

# All app names
ALL_APPS="shell shell-api hopefull-admin assest-management cmms family-fun booking-guest booking-host elearning-admin elearning-student"

# Database configuration
DB_CONTAINER="shell-postgres"
DB_PORT="5432"
DB_NAME="shell_apps"
DB_USER="shell"
DB_PASSWORD="shell123"

# Get app path
get_app_path() {
    get_app_config "$1" | cut -d: -f1
}

# Get app port
get_app_port() {
    get_app_config "$1" | cut -d: -f2
}

# Get app PM2 name
get_app_pm2_name() {
    get_app_config "$1" | cut -d: -f3
}

# Check if app exists
app_exists() {
    [ -n "$(get_app_config "$1")" ]
}

# List available apps
list_apps() {
    echo "Available apps:"
    for app in $ALL_APPS; do
        local port=$(get_app_port "$app")
        printf "  %-20s (port %s)\n" "$app" "$port"
    done
}

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

# Check if Docker is available on server
check_docker() {
    print_status "Checking Docker on server..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << 'ENDSSH'
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed"
    echo ""
    echo "Install Docker:"
    echo "  curl -fsSL https://get.docker.com | sh"
    echo "  sudo usermod -aG docker $USER"
    echo "  newgrp docker"
    exit 1
fi
echo "Docker: $(docker --version)"
ENDSSH
}

# Start database
start_database() {
    print_status "Starting PostgreSQL database..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
# Check if container exists
if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}\$"; then
    # Container exists, check if running
    if docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}\$"; then
        echo "Database already running"
    else
        echo "Starting existing container..."
        docker start ${DB_CONTAINER}
    fi
else
    echo "Creating new PostgreSQL container..."
    docker run -d \\
        --name ${DB_CONTAINER} \\
        -e POSTGRES_USER=${DB_USER} \\
        -e POSTGRES_PASSWORD=${DB_PASSWORD} \\
        -e POSTGRES_DB=${DB_NAME} \\
        -p ${DB_PORT}:5432 \\
        -v shell_postgres_data:/var/lib/postgresql/data \\
        --restart unless-stopped \\
        postgres:15-alpine

    echo "Waiting for database to be ready..."
    sleep 5
fi

# Verify connection
if docker exec ${DB_CONTAINER} pg_isready -U ${DB_USER} &>/dev/null; then
    echo "Database is ready"
else
    echo "WARNING: Database may not be ready yet"
fi
ENDSSH
    print_success "Database started"
}

# Stop database
stop_database() {
    print_status "Stopping PostgreSQL database..."
    ssh "${SERVER_USER}@${SERVER_IP}" "docker stop ${DB_CONTAINER} 2>/dev/null || echo 'Database not running'"
    print_success "Database stopped"
}

# Initialize database schema
init_database() {
    print_status "Initializing database schema..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    # Upload init.sql to server
    scp "${PROJECT_ROOT}/apps/shell/db/init.sql" "${SERVER_USER}@${SERVER_IP}:~/microfrontend/init.sql"

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
# Wait for database to be ready
echo "Waiting for database..."
for i in {1..30}; do
    if docker exec ${DB_CONTAINER} pg_isready -U ${DB_USER} &>/dev/null; then
        break
    fi
    sleep 1
done

# Run init script
echo "Running init.sql..."
docker exec -i ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} < ~/microfrontend/init.sql

echo "Database initialized"
ENDSSH
    print_success "Database schema initialized"
}

# Database status
database_status() {
    print_status "Checking database status..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
echo "=== Docker Container Status ==="
if docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E "(NAMES|${DB_CONTAINER})"; then
    :
else
    echo "Container ${DB_CONTAINER} not found"
fi

echo ""
echo "=== Database Connection ==="
if docker exec ${DB_CONTAINER} pg_isready -U ${DB_USER} 2>/dev/null; then
    echo "PostgreSQL: READY"
    echo ""
    echo "=== Tables ==="
    docker exec ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} -c "\\dt" 2>/dev/null || echo "No tables found"
    echo ""
    echo "=== App Count ==="
    docker exec ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT COUNT(*) as apps FROM apps;" 2>/dev/null || echo "Could not query apps"
else
    echo "PostgreSQL: NOT RUNNING"
fi
ENDSSH
}

# Database logs
database_logs() {
    print_status "Showing database logs..."
    ssh -t "${SERVER_USER}@${SERVER_IP}" "docker logs -f ${DB_CONTAINER}"
}

# Run database migrations (for existing databases)
migrate_database() {
    print_status "Running database migrations..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    # Upload init.sql to server
    scp "${PROJECT_ROOT}/apps/shell/db/init.sql" "${SERVER_USER}@${SERVER_IP}:~/microfrontend/init.sql"

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
# Wait for database to be ready
echo "Waiting for database..."
for i in {1..30}; do
    if docker exec ${DB_CONTAINER} pg_isready -U ${DB_USER} &>/dev/null; then
        break
    fi
    sleep 1
done

# Run init script (includes migrations with IF NOT EXISTS)
echo "Running migrations..."
docker exec -i ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} < ~/microfrontend/init.sql 2>&1 | grep -v "already exists" || true

echo "Migrations completed"
ENDSSH
    print_success "Database migrations completed"
}

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

    # Build shell
    print_status "Building shell..."
    cd "apps/shell"
    if [ -f "webpack.config.prod.js" ]; then
        npx webpack --config webpack.config.prod.js
    else
        npm run build
    fi
    cd "$PROJECT_ROOT"

    # Build hopefull-admin
    print_status "Building hopefull-admin..."
    cd "apps/hopefull-admin"
    if [ -f "webpack.config.prod.js" ]; then
        npx webpack --config webpack.config.prod.js
    else
        npx webpack --mode production
    fi
    cd "$PROJECT_ROOT"

    # Build assest-management
    print_status "Building assest-management..."
    cd "apps/assest-management"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build cmms
    print_status "Building cmms..."
    cd "apps/cmms"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build FamilyFun
    print_status "Building FamilyFun..."
    cd "apps/FamilyFun/frontend"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build BookingSystem guest-portal
    print_status "Building booking-guest-portal..."
    cd "apps/BookingSystem/packages/guest-portal"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build BookingSystem host-portal
    print_status "Building booking-host-portal..."
    cd "apps/BookingSystem/packages/host-portal"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build elearning admin-portal
    print_status "Building elearning-admin-portal..."
    cd "apps/elearning/admin-portal"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    # Build elearning student-portal
    print_status "Building elearning-student-portal..."
    cd "apps/elearning/student-portal"
    npx webpack --mode production
    cd "$PROJECT_ROOT"

    print_success "Build completed"
}

# Build single app
build_single_app() {
    local app_name="$1"

    if ! app_exists "$app_name"; then
        print_error "Unknown app: $app_name"
        list_apps
        exit 1
    fi

    local app_path=$(get_app_path "$app_name")

    print_status "Building $app_name..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        pnpm install
    fi

    export REMOTE_HOST="http://${SERVER_IP}"

    cd "$app_path"
    if [ -f "webpack.config.prod.js" ]; then
        npx webpack --config webpack.config.prod.js
    else
        npx webpack --mode production
    fi
    cd "$PROJECT_ROOT"

    print_success "Build completed for $app_name"
}

# Create single app deployment package
create_single_app_package() {
    local app_name="$1"
    local app_path=$(get_app_path "$app_name")

    print_status "Creating deployment package for $app_name..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    TEMP_DIR=$(mktemp -d)
    DEPLOY_ARCHIVE="$TEMP_DIR/deploy-${app_name}.tar.gz"

    tar -czf "$DEPLOY_ARCHIVE" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        "${app_path}/dist" \
        "${app_path}/package.json"

    print_success "Package created for $app_name"
    echo "$DEPLOY_ARCHIVE"
}

# Deploy single app
deploy_single_app() {
    local app_name="$1"
    local app_path=$(get_app_path "$app_name")
    local app_port=$(get_app_port "$app_name")
    local pm2_name=$(get_app_pm2_name "$app_name")

    print_status "Deploying $app_name to ${SERVER_IP}..."

    ARCHIVE_PATH=$(create_single_app_package "$app_name")

    # Create remote directory
    ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p ~/microfrontend/${app_path}"

    # Upload files
    print_status "Uploading $app_name..."
    scp "$ARCHIVE_PATH" "${SERVER_USER}@${SERVER_IP}:~/microfrontend/deploy-${app_name}.tar.gz"

    # Extract and restart on server
    print_status "Restarting $app_name service..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}

cd ~/microfrontend

# Backup old dist
if [ -d "${app_path}/dist" ]; then
    rm -rf "${app_path}/dist.backup" 2>/dev/null || true
    mv "${app_path}/dist" "${app_path}/dist.backup" 2>/dev/null || true
fi

# Extract new files
tar -xzf deploy-${app_name}.tar.gz
rm deploy-${app_name}.tar.gz

# Install serve if needed
cd ~/microfrontend/${app_path}
npm install serve --save-dev 2>/dev/null || true

# Restart only this app in PM2
pm2 restart ${pm2_name} 2>/dev/null || pm2 start npx --name "${pm2_name}" -- serve dist -p ${app_port} -s --cors

pm2 save

echo ""
echo "=== ${app_name} Status ==="
pm2 show ${pm2_name}

echo ""
if ss -tuln 2>/dev/null | grep -q ":${app_port} "; then
    echo "Port ${app_port}: OK"
else
    echo "Port ${app_port}: NOT LISTENING (may take a moment)"
fi
ENDSSH

    # Cleanup
    rm -rf "$(dirname "$ARCHIVE_PATH")"

    print_success "$app_name deployed successfully!"
    echo ""
    echo "Access at: http://${SERVER_IP}:${app_port}"
}

# Full single app deploy (build + deploy)
full_deploy_single_app() {
    local app_name="$1"

    check_requirements
    test_connection
    build_single_app "$app_name"
    deploy_single_app "$app_name"
}

# Create deployment package
create_package() {
    print_status "Creating deployment package..."

    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    TEMP_DIR=$(mktemp -d)
    DEPLOY_ARCHIVE="$TEMP_DIR/deploy.tar.gz"

    # Include dist folders, server files, and necessary files
    tar -czf "$DEPLOY_ARCHIVE" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        apps/shell/dist \
        apps/shell/server \
        apps/shell/db \
        apps/shell/public/screenshots \
        apps/hopefull-admin/dist \
        apps/assest-management/dist \
        apps/cmms/dist \
        apps/FamilyFun/frontend/dist \
        apps/BookingSystem/packages/guest-portal/dist \
        apps/BookingSystem/packages/host-portal/dist \
        apps/elearning/admin-portal/dist \
        apps/elearning/student-portal/dist \
        apps/shell/package.json \
        apps/hopefull-admin/package.json \
        apps/assest-management/package.json \
        apps/cmms/package.json \
        apps/FamilyFun/frontend/package.json \
        apps/BookingSystem/packages/guest-portal/package.json \
        apps/BookingSystem/packages/host-portal/package.json \
        apps/elearning/admin-portal/package.json \
        apps/elearning/student-portal/package.json \
        ecosystem.config.js \
        package.json

    print_success "Package created"
    echo "$DEPLOY_ARCHIVE"
}

# Deploy to server
deploy() {
    print_status "Deploying to ${SERVER_IP}..."

    # Start database first
    check_docker
    start_database

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
for app in shell hopefull-admin assest-management cmms; do
    if [ -d "apps/\${app}/dist" ]; then
        rm -rf "apps/\${app}/dist.backup" 2>/dev/null || true
        mv "apps/\${app}/dist" "apps/\${app}/dist.backup" 2>/dev/null || true
    fi
done

# Backup nested app dist folders
for nested_app in "FamilyFun/frontend" "BookingSystem/packages/guest-portal" "BookingSystem/packages/host-portal" "elearning/admin-portal" "elearning/student-portal"; do
    if [ -d "apps/\${nested_app}/dist" ]; then
        rm -rf "apps/\${nested_app}/dist.backup" 2>/dev/null || true
        mv "apps/\${nested_app}/dist" "apps/\${nested_app}/dist.backup" 2>/dev/null || true
    fi
done

# Extract new files
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Install serve package for each app
for app in shell hopefull-admin assest-management cmms; do
    cd ~/microfrontend/apps/\${app}
    npm install serve --save-dev 2>/dev/null || true
done

# Install serve for nested apps
for nested_app in "FamilyFun/frontend" "BookingSystem/packages/guest-portal" "BookingSystem/packages/host-portal" "elearning/admin-portal" "elearning/student-portal"; do
    cd ~/microfrontend/apps/\${nested_app}
    npm install serve --save-dev 2>/dev/null || true
done

# Install API server dependencies
echo "Installing API server dependencies..."
cd ~/microfrontend/apps/shell/server
npm install --production 2>/dev/null || true

cd ~/microfrontend

# Initialize database schema
echo "Initializing database..."
if [ -f "apps/shell/db/init.sql" ]; then
    docker exec -i ${DB_CONTAINER} psql -U ${DB_USER} -d ${DB_NAME} < apps/shell/db/init.sql 2>/dev/null || echo "Database init may have warnings (tables may already exist)"
fi

# Start with PM2
pm2 start ecosystem.config.js

# Setup Cloudflare Tunnel (no sudo required)
echo ""
echo "=== Setting up Cloudflare Tunnel ==="
if [ ! -f ~/cloudflared ]; then
    echo "Downloading cloudflared..."
    curl -sL -o ~/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
    chmod +x ~/cloudflared
    echo "cloudflared installed"
else
    echo "cloudflared already installed"
fi

# Stop existing tunnel if running
pm2 delete cloudflare-tunnel 2>/dev/null || true

# Start tunnel with PM2
pm2 start ~/cloudflared --name "cloudflare-tunnel" -- tunnel --url http://localhost:3100

# Save PM2 process list
pm2 save

# Wait for tunnel to start
sleep 3

# Show status
echo ""
echo "=== PM2 Status ==="
pm2 list

echo ""
echo "=== Checking ports ==="
for port in 3100 3101 3102 3103 3104 3105 3106 3107 3108; do
    if netstat -tuln 2>/dev/null | grep -q ":\${port} " || ss -tuln 2>/dev/null | grep -q ":\${port} "; then
        echo "Port \${port}: OK"
    else
        echo "Port \${port}: NOT LISTENING (may take a moment to start)"
    fi
done

echo ""
echo "=== Cloudflare Tunnel URL ==="
sleep 2
pm2 logs cloudflare-tunnel --lines 20 --nostream 2>/dev/null | grep -o 'https://[^[:space:]]*\.trycloudflare\.com' | tail -1 || echo "Check tunnel URL with: pm2 logs cloudflare-tunnel"
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
    echo "  Local:            http://${SERVER_IP}:3100"
    echo "  Cloudflare:       Check tunnel URL with: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs cloudflare-tunnel --lines 10 --nostream | grep trycloudflare'"
    echo ""
    echo "Backend Services:"
    echo "  PostgreSQL:         localhost:5432 (container: ${DB_CONTAINER})"
    echo "  Shell API:          http://${SERVER_IP}:3150"
    echo ""
    echo "Frontend Apps (ports 3100-3108):"
    echo "  Shell:              http://${SERVER_IP}:3100"
    echo "  Hopefull Admin:     http://${SERVER_IP}:3101"
    echo "  Asset Management:   http://${SERVER_IP}:3102"
    echo "  CMMS:               http://${SERVER_IP}:3103"
    echo "  FamilyFun:          http://${SERVER_IP}:3104"
    echo "  Booking Guest:      http://${SERVER_IP}:3105"
    echo "  Booking Host:       http://${SERVER_IP}:3106"
    echo "  E-Learning Admin:   http://${SERVER_IP}:3107"
    echo "  E-Learning Student: http://${SERVER_IP}:3108"
    echo ""
    echo "Database Commands:"
    echo "  $0 db:status       # Check database status"
    echo "  $0 db:logs         # View database logs"
    echo ""
}

# Show status
status() {
    print_status "Checking status on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}

echo "=== Database Status ==="
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${DB_CONTAINER}\$"; then
    echo "PostgreSQL: RUNNING"
    if docker exec ${DB_CONTAINER} pg_isready -U ${DB_USER} &>/dev/null; then
        echo "Connection: READY"
    else
        echo "Connection: NOT READY"
    fi
else
    echo "PostgreSQL: NOT RUNNING"
fi

echo ""
echo "=== PM2 Status ==="
pm2 list 2>/dev/null || echo "PM2 not running"

echo ""
echo "=== Port Status ==="
check_port() {
    local port=\$1
    local name=\$2
    if netstat -tuln 2>/dev/null | grep -q ":\${port} " || ss -tuln 2>/dev/null | grep -q ":\${port} "; then
        printf "  %-25s (port %s): LISTENING\n" "\$name" "\$port"
    else
        printf "  %-25s (port %s): NOT LISTENING\n" "\$name" "\$port"
    fi
}

check_port 5432 "PostgreSQL"
check_port 3150 "Shell API"
check_port 3100 "Shell"
check_port 3101 "Hopefull Admin"
check_port 3102 "Asset Management"
check_port 3103 "CMMS"
check_port 3104 "FamilyFun"
check_port 3105 "Booking Guest"
check_port 3106 "Booking Host"
check_port 3107 "E-Learning Admin"
check_port 3108 "E-Learning Student"
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
    echo "Usage: $0 [command] [app-name]"
    echo ""
    echo "Commands:"
    echo "  deploy           - Build and deploy ALL apps (default)"
    echo "  deploy:app NAME  - Build and deploy a single app"
    echo "  status           - Check service status (includes database)"
    echo "  start            - Start services"
    echo "  stop             - Stop services"
    echo "  restart          - Restart services"
    echo "  restart:app NAME - Restart a single app"
    echo "  logs             - View PM2 logs"
    echo "  logs:app NAME    - View logs for a single app"
    echo "  list             - List available apps"
    echo "  setup            - Show server setup instructions"
    echo "  setup-nginx      - Setup Nginx reverse proxy (port 80 -> 3100)"
    echo ""
    echo "Database Commands:"
    echo "  db:start         - Start PostgreSQL database container"
    echo "  db:stop          - Stop PostgreSQL database container"
    echo "  db:status        - Show database status and table info"
    echo "  db:init          - Initialize/reset database schema"
    echo "  db:migrate       - Run database migrations (add new columns)"
    echo "  db:logs          - View database logs"
    echo ""
    echo "Examples:"
    echo "  $0 deploy              # Deploy all apps with database"
    echo "  $0 deploy:app shell    # Deploy only shell"
    echo "  $0 deploy:app shell-api # Deploy only API server"
    echo "  $0 db:start            # Start database only"
    echo "  $0 db:status           # Check database status"
    echo "  $0 restart:app shell   # Restart only shell"
    echo "  $0 list                # Show available apps"
    echo ""
    list_apps
}

# Server setup instructions
setup_instructions() {
    echo "============================================"
    echo "Server Setup Instructions"
    echo "============================================"
    echo ""
    echo "1. Install Docker (requires sudo once):"
    echo "   curl -fsSL https://get.docker.com | sh"
    echo "   sudo usermod -aG docker \$USER"
    echo "   newgrp docker"
    echo ""
    echo "2. Install nvm and Node.js 18 (no sudo required):"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "   source ~/.bashrc"
    echo "   nvm install 18"
    echo ""
    echo "3. Install PM2 globally:"
    echo "   npm install -g pm2"
    echo ""
    echo "4. (Optional) Install pnpm:"
    echo "   npm install -g pnpm"
    echo ""
    echo "5. (Optional) Setup PM2 to start on boot (requires sudo):"
    echo "   pm2 startup"
    echo "   # Follow the instructions it outputs"
    echo ""
    echo "6. Setup Nginx reverse proxy (requires sudo):"
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

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;

    # API Server
    location /api/ {
        proxy_pass http://127.0.0.1:3150/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Screenshots - served from API server
    location /screenshots/ {
        proxy_pass http://127.0.0.1:3150/screenshots/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_valid 200 1d;
    }

    # Shell App (catch-all)
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

# Restart single app
restart_single_app() {
    local app_name="$1"

    if ! app_exists "$app_name"; then
        print_error "Unknown app: $app_name"
        list_apps
        exit 1
    fi

    local pm2_name=$(get_app_pm2_name "$app_name")

    print_status "Restarting $app_name..."
    ssh "${SERVER_USER}@${SERVER_IP}" "bash -s" << ENDSSH
${NVM_LOADER}
pm2 restart ${pm2_name}
pm2 show ${pm2_name}
ENDSSH
    print_success "$app_name restarted"
}

# View logs for single app
logs_single_app() {
    local app_name="$1"

    if ! app_exists "$app_name"; then
        print_error "Unknown app: $app_name"
        list_apps
        exit 1
    fi

    local pm2_name=$(get_app_pm2_name "$app_name")

    print_status "Streaming logs for $app_name..."
    ssh -t "${SERVER_USER}@${SERVER_IP}" "bash -c 'source ~/.nvm/nvm.sh 2>/dev/null; pm2 logs ${pm2_name}'"
}

# Main
main() {
    case "${1:-deploy}" in
        deploy)
            full_deploy
            ;;
        deploy:app)
            if [ -z "$2" ]; then
                print_error "App name required"
                list_apps
                exit 1
            fi
            full_deploy_single_app "$2"
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
        restart:app)
            if [ -z "$2" ]; then
                print_error "App name required"
                list_apps
                exit 1
            fi
            restart_single_app "$2"
            ;;
        logs)
            logs
            ;;
        logs:app)
            if [ -z "$2" ]; then
                print_error "App name required"
                list_apps
                exit 1
            fi
            logs_single_app "$2"
            ;;
        list)
            list_apps
            ;;
        setup)
            setup_instructions
            ;;
        setup-nginx)
            setup_nginx
            ;;
        # Database commands
        db:start)
            check_docker
            start_database
            ;;
        db:stop)
            stop_database
            ;;
        db:status)
            database_status
            ;;
        db:init)
            check_docker
            start_database
            init_database
            ;;
        db:migrate)
            migrate_database
            ;;
        db:logs)
            database_logs
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
