#!/bin/bash

# ============================================================
# Microfrontend Deployment Script
# Target: VMware HONGHOANG-DEMO.saigontechnology
# Server: demo (10.30.10.18)
# ============================================================

set -e

# Configuration
SERVER_IP="10.30.10.18"
SERVER_USER="${SERVER_USER:-honghoang}"
PROJECT_NAME="microfrontend"
# Deploy to user's home directory (no sudo required)
REMOTE_DIR="\$HOME/${PROJECT_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."

    if ! command -v ssh &> /dev/null; then
        print_error "SSH is not installed"
        exit 1
    fi

    if ! command -v scp &> /dev/null; then
        print_error "SCP is not installed"
        exit 1
    fi

    print_success "All requirements met"
}

# Test SSH connection
test_connection() {
    print_status "Testing SSH connection to ${SERVER_USER}@${SERVER_IP}..."

    if ssh -o ConnectTimeout=10 -o BatchMode=yes "${SERVER_USER}@${SERVER_IP}" "echo 'Connection successful'" &> /dev/null; then
        print_success "SSH connection established"
    else
        print_warning "SSH key not configured. You'll be prompted for password."
    fi
}

# Check if Docker is available on server
check_docker() {
    print_status "Checking Docker on server..."

    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        if ! command -v docker &> /dev/null; then
            echo "ERROR: Docker is not installed."
            echo ""
            echo "Please ask your system administrator to run:"
            echo "  sudo bash server-setup.sh"
            echo ""
            echo "Or install Docker manually:"
            echo "  sudo apt-get update"
            echo "  sudo apt-get install -y docker.io docker-compose-plugin"
            echo "  sudo usermod -aG docker $USER"
            echo "  sudo systemctl enable docker"
            echo "  sudo systemctl start docker"
            echo ""
            echo "Then log out and log back in."
            exit 1
        fi

        # Check if user can run docker
        if ! docker ps &> /dev/null; then
            echo "ERROR: Cannot run docker commands."
            echo "Your user may not be in the docker group."
            echo ""
            echo "Ask your administrator to run:"
            echo "  sudo usermod -aG docker $USER"
            echo ""
            echo "Then log out and log back in."
            exit 1
        fi

        echo "Docker version: $(docker --version)"
        if docker compose version &> /dev/null; then
            echo "Docker Compose version: $(docker compose version)"
        elif command -v docker-compose &> /dev/null; then
            echo "Docker Compose version: $(docker-compose --version)"
        else
            echo "WARNING: docker-compose not found, but docker compose plugin may work"
        fi
ENDSSH

    print_success "Docker is available"
}

# Create deployment package
create_package() {
    print_status "Creating deployment package..."

    # Get script directory and project root
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

    cd "$PROJECT_ROOT"

    # Create temporary directory for deployment files
    TEMP_DIR=$(mktemp -d)
    DEPLOY_ARCHIVE="$TEMP_DIR/deploy.tar.gz"

    # Create tarball excluding unnecessary files
    tar -czf "$DEPLOY_ARCHIVE" \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='.env.local' \
        .

    print_success "Deployment package created"
    echo "$DEPLOY_ARCHIVE"
}

# Deploy to server
deploy() {
    print_status "Deploying to ${SERVER_IP}..."

    ARCHIVE_PATH=$(create_package)

    # Create remote directory and upload
    print_status "Creating remote directory..."
    ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p ~/microfrontend"

    print_status "Uploading files..."
    scp "$ARCHIVE_PATH" "${SERVER_USER}@${SERVER_IP}:~/microfrontend/deploy.tar.gz"

    # Extract and build on server
    print_status "Building and starting containers..."
    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        cd ~/microfrontend

        # Stop existing containers
        docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

        # Backup old files (just apps folder)
        if [ -d "apps" ]; then
            rm -rf apps.backup 2>/dev/null || true
            cp -r apps apps.backup 2>/dev/null || true
        fi

        # Extract new files
        tar -xzf deploy.tar.gz
        rm deploy.tar.gz

        # Build and start containers
        echo "Building Docker image (this may take a few minutes)..."
        if docker compose build --no-cache; then
            echo "Starting containers..."
            docker compose up -d
        elif docker-compose build --no-cache; then
            echo "Starting containers..."
            docker-compose up -d
        else
            echo "Build failed!"
            exit 1
        fi

        # Wait for services
        echo "Waiting for services to start..."
        sleep 10

        # Check status
        echo ""
        echo "=== Container Status ==="
        docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null
ENDSSH

    # Cleanup local temp files
    rm -rf "$(dirname "$ARCHIVE_PATH")"

    print_success "Deployment completed!"
}

# Show status
status() {
    print_status "Checking deployment status on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        cd ~/microfrontend 2>/dev/null || { echo "Project not deployed yet"; exit 0; }

        echo "=== Container Status ==="
        docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null || echo "No containers running"

        echo ""
        echo "=== Container Logs (last 20 lines) ==="
        docker compose logs --tail=20 2>/dev/null || docker-compose logs --tail=20 2>/dev/null || echo "No logs available"
ENDSSH
}

# Stop services
stop() {
    print_status "Stopping services on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        cd ~/microfrontend 2>/dev/null || { echo "Project not found"; exit 0; }
        docker compose down 2>/dev/null || docker-compose down 2>/dev/null || echo "No containers to stop"
ENDSSH

    print_success "Services stopped"
}

# Start services
start() {
    print_status "Starting services on ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        cd ~/microfrontend || { echo "Project not found"; exit 1; }
        docker compose up -d 2>/dev/null || docker-compose up -d
ENDSSH

    print_success "Services started"
}

# View logs
logs() {
    print_status "Streaming logs from ${SERVER_IP}..."

    ssh "${SERVER_USER}@${SERVER_IP}" "cd ~/microfrontend && (docker compose logs -f 2>/dev/null || docker-compose logs -f)"
}

# Rollback
rollback() {
    print_status "Rolling back to previous version..."

    ssh "${SERVER_USER}@${SERVER_IP}" 'bash -s' << 'ENDSSH'
        cd ~/microfrontend

        if [ -d "apps.backup" ]; then
            docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true
            rm -rf apps
            mv apps.backup apps
            docker compose build || docker-compose build
            docker compose up -d || docker-compose up -d
            echo "Rollback completed"
        else
            echo "No backup available for rollback"
            exit 1
        fi
ENDSSH

    print_success "Rollback completed"
}

# Print usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy    - Deploy the application to the server (default)"
    echo "  status    - Check deployment status"
    echo "  start     - Start the services"
    echo "  stop      - Stop the services"
    echo "  restart   - Restart the services"
    echo "  rollback  - Rollback to previous version"
    echo "  logs      - View container logs"
    echo ""
    echo "Environment Variables:"
    echo "  SERVER_USER - SSH username (default: honghoang)"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  SERVER_USER=admin $0 deploy"
}

# Main
main() {
    case "${1:-deploy}" in
        deploy)
            check_requirements
            test_connection
            check_docker
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
            stop
            start
            ;;
        rollback)
            rollback
            ;;
        logs)
            logs
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
