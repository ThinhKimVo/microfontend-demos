#!/bin/bash

# ============================================================
# Server Setup Script - Run this with sudo/root access
# Target: VMware HONGHOANG-DEMO.saigontechnology
# Server: demo (10.30.10.18)
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo: sudo bash server-setup.sh"
    exit 1
fi

print_status "Setting up server for microfrontend deployment..."

# Update package list
print_status "Updating package list..."
apt-get update -qq

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Set up stable repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -qq
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# Start and enable Docker
systemctl start docker
systemctl enable docker
print_success "Docker service started and enabled"

# Add honghoang user to docker group
if id "honghoang" &>/dev/null; then
    usermod -aG docker honghoang
    print_success "Added honghoang to docker group"
else
    print_warning "User honghoang not found, skipping docker group addition"
fi

# Create deployment directory
DEPLOY_DIR="/opt/microfrontend"
mkdir -p "$DEPLOY_DIR"
chown -R honghoang:honghoang "$DEPLOY_DIR" 2>/dev/null || chown -R $(id -un 1000):$(id -gn 1000) "$DEPLOY_DIR"
chmod 755 "$DEPLOY_DIR"
print_success "Created deployment directory: $DEPLOY_DIR"

# Open firewall ports if ufw is active
if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
    print_status "Configuring firewall..."
    ufw allow 3100/tcp  # Shell
    ufw allow 3101/tcp  # React Remote
    ufw allow 3102/tcp  # Vue Remote
    ufw allow 3103/tcp  # Angular Remote
    ufw allow 3105/tcp  # Hopefull Admin
    print_success "Firewall ports opened"
fi

# Print versions
print_status "Installed versions:"
docker --version
docker compose version

print_success "Server setup complete!"
echo ""
echo "Next steps:"
echo "  1. Log out and log back in for docker group changes to take effect"
echo "  2. Run the deployment script from your local machine:"
echo "     SERVER_USER=honghoang ./scripts/deploy.sh deploy"
