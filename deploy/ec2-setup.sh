#!/bin/bash

# EC2 Setup Script for MindCare Application
# This script should be run on a fresh Ubuntu 22.04 EC2 instance

set -e

echo "🚀 Starting EC2 setup for MindCare application..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
echo "📦 Installing PostgreSQL client..."
sudo apt-get install -y postgresql-client

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Install Certbot for SSL
echo "📦 Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/mindcare
sudo chown ubuntu:ubuntu /var/www/mindcare

# Install Git if not present
echo "📦 Installing Git..."
sudo apt-get install -y git

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5001
sudo ufw --force enable

echo "✅ EC2 setup completed successfully!"
echo "📝 Next steps:"
echo "1. Clone your repository to /var/www/mindcare"
echo "2. Configure environment variables"
echo "3. Set up RDS connection"
echo "4. Run the deployment script" 