#!/bin/bash

# RDS PostgreSQL Setup Script
# This script helps set up and configure RDS PostgreSQL for MindCare

set -e

echo "🗄️ RDS PostgreSQL Setup for MindCare"

# Configuration variables (update these with your RDS details)
RDS_ENDPOINT="your-rds-endpoint.region.rds.amazonaws.com"
RDS_PORT="5432"
RDS_DATABASE="mindcare"
RDS_USERNAME="mindcare_admin"
RDS_PASSWORD="your-secure-password"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 RDS Configuration:${NC}"
echo "Endpoint: $RDS_ENDPOINT"
echo "Port: $RDS_PORT"
echo "Database: $RDS_DATABASE"
echo "Username: $RDS_USERNAME"

# Test connection to RDS
echo -e "\n${YELLOW}🔍 Testing RDS connection...${NC}"
if pg_isready -h "$RDS_ENDPOINT" -p "$RDS_PORT" -U "$RDS_USERNAME"; then
    echo -e "${GREEN}✅ RDS connection successful!${NC}"
else
    echo -e "${RED}❌ RDS connection failed!${NC}"
    echo "Please check your RDS configuration and security groups."
    exit 1
fi

# Create database if it doesn't exist
echo -e "\n${YELLOW}📁 Creating database if it doesn't exist...${NC}"
PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_ENDPOINT" -p "$RDS_PORT" -U "$RDS_USERNAME" -d postgres -c "CREATE DATABASE $RDS_DATABASE;" 2>/dev/null || echo "Database already exists or creation failed"

# Test database connection
echo -e "\n${YELLOW}🔍 Testing database connection...${NC}"
if PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_ENDPOINT" -p "$RDS_PORT" -U "$RDS_USERNAME" -d "$RDS_DATABASE" -c "SELECT version();"; then
    echo -e "${GREEN}✅ Database connection successful!${NC}"
else
    echo -e "${RED}❌ Database connection failed!${NC}"
    exit 1
fi

# Create .env file for production
echo -e "\n${YELLOW}📝 Creating production .env file...${NC}"
cat > server/.env.production << EOF
DATABASE_URL=postgres://$RDS_USERNAME:$RDS_PASSWORD@$RDS_ENDPOINT:$RDS_PORT/$RDS_DATABASE
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
PORT=5001
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Production .env file created!${NC}"

# Initialize database tables
echo -e "\n${YELLOW}🗃️ Initializing database tables...${NC}"
cd server
NODE_ENV=production npm run init-db

echo -e "\n${GREEN}✅ RDS setup completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update your application's .env file with the production database URL"
echo "2. Run the deployment script to deploy your application"
echo "3. Test the application with the new RDS database" 