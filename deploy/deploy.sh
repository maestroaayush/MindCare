#!/bin/bash

# MindCare Deployment Script
# This script deploys the application to production

set -e

# Configuration
APP_DIR="/var/www/mindcare"
BACKEND_DIR="$APP_DIR/server"
FRONTEND_DIR="$APP_DIR/client"
DOMAIN="your-domain.com"

echo "🚀 Starting MindCare deployment..."

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Application directory not found. Please run ec2-setup.sh first."
    exit 1
fi

# Navigate to application directory
cd "$APP_DIR"

# Pull latest changes from Git
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --production

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --production

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
cd "$BACKEND_DIR"
mkdir -p uploads

# Set proper permissions
echo "🔐 Setting proper permissions..."
sudo chown -R ubuntu:ubuntu "$APP_DIR"
chmod -R 755 "$APP_DIR"
chmod -R 777 "$BACKEND_DIR/uploads"

# Restart backend with PM2
echo "🔄 Restarting backend with PM2..."
cd "$BACKEND_DIR"
pm2 delete mindcare-backend 2>/dev/null || true
pm2 start index.js --name "mindcare-backend" --env production
pm2 save

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp "$APP_DIR/deploy/nginx-config" /etc/nginx/sites-available/mindcare
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/mindcare
sudo ln -sf /etc/nginx/sites-available/mindcare /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

# Setup SSL certificate (if domain is configured)
if [ "$DOMAIN" != "your-domain.com" ]; then
    echo "🔒 Setting up SSL certificate..."
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
fi

# Create PM2 startup script
echo "⚡ Setting up PM2 startup script..."
pm2 startup
pm2 save

echo "✅ Deployment completed successfully!"
echo "📝 Application is now running at: https://$DOMAIN"
echo "📊 PM2 Status:"
pm2 status
echo "🌐 Nginx Status:"
sudo systemctl status nginx --no-pager 