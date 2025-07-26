# MindCare Deployment Guide

This guide provides step-by-step instructions for deploying the MindCare application on AWS using EC2 and RDS PostgreSQL.

## 🏗️ Architecture Overview

```
Internet → CloudFront (optional) → EC2 (Nginx + React) → RDS PostgreSQL
```

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **Domain Name** (optional, for SSL certificate)
3. **Git Repository** with your MindCare code
4. **AWS CLI** and **Terraform** installed locally

## 🚀 Quick Deployment

### Option 1: Automated Terraform Deployment (Recommended)

1. **Clone and configure Terraform**:
   ```bash
   cd deploy/aws-terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Deploy infrastructure**:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

3. **SSH to EC2 and deploy application**:
   ```bash
   ssh -i your-key.pem ubuntu@<EC2_IP>
   cd /var/www
   sudo git clone https://github.com/your-username/mindcare.git
   sudo chown -R ubuntu:ubuntu mindcare
   cd mindcare
   chmod +x deploy/*.sh
   ./deploy/ec2-setup.sh
   ./deploy/rds-setup.sh
   ./deploy/deploy.sh
   ```

### Option 2: Manual AWS Setup

1. **Create EC2 instance** (Ubuntu 22.04 LTS)
2. **Create RDS PostgreSQL instance**
3. **Configure security groups**
4. **Run deployment scripts**

## 📁 Deployment Files

### Infrastructure Scripts
- `ec2-setup.sh` - Sets up EC2 instance with dependencies
- `rds-setup.sh` - Configures RDS PostgreSQL connection
- `deploy.sh` - Main deployment script
- `nginx-config` - Nginx configuration for reverse proxy

### Terraform Configuration
- `aws-terraform/main.tf` - Main infrastructure configuration
- `aws-terraform/variables.tf` - Variable definitions
- `aws-terraform/terraform.tfvars.example` - Example variables

### Application Configuration
- `ecosystem.config.js` - PM2 process manager configuration

## 🔧 Configuration

### Environment Variables

**Production (.env.production)**:
```bash
DATABASE_URL=postgres://username:password@rds-endpoint:5432/mindcare
JWT_SECRET=your-super-secure-jwt-secret
PORT=5001
NODE_ENV=production
```

**Frontend API Configuration**:
Update `client/src/utils/api.js`:
```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

### Nginx Configuration

Update `nginx-config` with your domain:
```nginx
server_name your-domain.com www.your-domain.com;
```

## 🔒 Security Configuration

### SSL Certificate
```bash
# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Database Security
- RDS in private subnet
- Security group allows only EC2 access
- Encryption enabled
- Regular backups

### Application Security
- HTTPS enforced
- Security headers configured
- JWT authentication
- Input validation

## 📊 Monitoring and Logs

### PM2 Process Management
```bash
# Check application status
pm2 status

# View logs
pm2 logs mindcare-backend

# Restart application
pm2 restart mindcare-backend
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Application Logs
```bash
# Backend logs
tail -f /var/log/mindcare/backend-combined.log
```

## 🔄 Deployment Process

### Initial Deployment
1. **Infrastructure Setup** (Terraform)
2. **EC2 Configuration** (ec2-setup.sh)
3. **Database Setup** (rds-setup.sh)
4. **Application Deployment** (deploy.sh)

### Continuous Deployment
```bash
# Pull latest changes
git pull origin main

# Deploy updates
./deploy/deploy.sh
```

### PM2 Deployment
```bash
# Setup PM2 deployment
pm2 deploy ecosystem.config.js production setup

# Deploy with PM2
pm2 deploy ecosystem.config.js production
```

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check RDS security group
   # Verify DATABASE_URL in .env
   # Test connection manually
   psql -h rds-endpoint -U username -d mindcare
   ```

2. **Nginx Configuration Error**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Check syntax
   sudo nginx -T
   ```

3. **Application Not Starting**
   ```bash
   # Check PM2 logs
   pm2 logs mindcare-backend
   
   # Check environment variables
   pm2 env mindcare-backend
   ```

4. **SSL Certificate Issues**
   ```bash
   # Renew certificate
   sudo certbot renew
   
   # Check certificate status
   sudo certbot certificates
   ```

### Performance Optimization

1. **Enable Gzip Compression** (already in nginx-config)
2. **Configure Caching** (already in nginx-config)
3. **Database Optimization**:
   ```sql
   -- Add indexes for better performance
   CREATE INDEX idx_users_email ON Users(email);
   CREATE INDEX idx_sessions_user_id ON Sessions(userId);
   ```

## 💰 Cost Optimization

### Current Costs (us-east-1)
- **EC2 t3.medium**: ~$30/month
- **RDS db.t3.micro**: ~$15/month
- **Storage & Transfer**: ~$5/month
- **Total**: ~$50/month

### Cost Reduction Options
1. **Use t3.small** for EC2 (saves ~$15/month)
2. **Use db.t3.micro** for RDS (already optimized)
3. **Reserved Instances** (saves 30-60%)
4. **Spot Instances** (saves 70-90% but less reliable)

## 🔄 Backup and Recovery

### Database Backups
- **Automated**: RDS daily backups (7-day retention)
- **Manual**: Create snapshots before major changes
- **Export**: Use pg_dump for data export

### Application Backups
```bash
# Backup application files
tar -czf mindcare-backup-$(date +%Y%m%d).tar.gz /var/www/mindcare

# Backup configuration
cp /etc/nginx/sites-available/mindcare mindcare-nginx-backup
```

## 📈 Scaling

### Vertical Scaling
- **EC2**: Upgrade to larger instance type
- **RDS**: Upgrade to larger instance class

### Horizontal Scaling
- **Load Balancer**: Add Application Load Balancer
- **Multiple EC2**: Deploy across multiple instances
- **Read Replicas**: Add RDS read replicas

## 🧹 Cleanup

### Remove Infrastructure
```bash
# Destroy Terraform resources
cd deploy/aws-terraform
terraform destroy
```

### Remove Application
```bash
# Stop PM2 processes
pm2 delete mindcare-backend

# Remove application files
sudo rm -rf /var/www/mindcare

# Remove Nginx configuration
sudo rm /etc/nginx/sites-enabled/mindcare
sudo rm /etc/nginx/sites-available/mindcare
```

## 📞 Support

For deployment issues:
1. Check logs in `/var/log/mindcare/`
2. Verify configuration files
3. Test connectivity manually
4. Review security group settings

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) 