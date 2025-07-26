# MindCare AWS Infrastructure with Terraform

This directory contains Terraform configurations to deploy the MindCare application on AWS with EC2 and RDS PostgreSQL.

## Prerequisites

1. **AWS CLI** installed and configured
2. **Terraform** installed (version >= 1.0)
3. **AWS Key Pair** created for EC2 access
4. **Domain name** (optional, for SSL certificate)

## Quick Start

### 1. Configure Variables

```bash
# Copy the example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit the variables file with your values
nano terraform.tfvars
```

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Plan the Deployment

```bash
terraform plan
```

### 4. Apply the Configuration

```bash
terraform apply
```

### 5. Get Output Values

```bash
terraform output
```

## Infrastructure Components

### VPC and Networking
- **VPC**: 10.0.0.0/16
- **Public Subnet**: 10.0.1.0/24 (for EC2)
- **Private Subnet**: 10.0.2.0/24 (for RDS)
- **Internet Gateway**: For public internet access
- **Route Tables**: Configured for proper routing

### Security Groups
- **EC2 Security Group**: Allows SSH (22), HTTP (80), HTTPS (443)
- **RDS Security Group**: Allows PostgreSQL (5432) from EC2 only

### EC2 Instance
- **Instance Type**: t3.medium (configurable)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 20GB GP3 volume
- **Elastic IP**: Static public IP

### RDS PostgreSQL
- **Engine**: PostgreSQL 15.4
- **Instance Class**: db.t3.micro (configurable)
- **Storage**: 20GB GP3, auto-scaling up to 100GB
- **Backup**: 7-day retention
- **Encryption**: Enabled

## Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region | us-east-1 |
| `ec2_ami` | AMI ID for EC2 | Ubuntu 22.04 LTS |
| `ec2_instance_type` | EC2 instance type | t3.medium |
| `rds_instance_class` | RDS instance class | db.t3.micro |
| `key_pair_name` | EC2 key pair name | Required |
| `db_password` | RDS database password | Required |
| `domain_name` | Domain name for SSL | your-domain.com |

## Post-Deployment Steps

1. **SSH to EC2 instance**:
   ```bash
   ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
   ```

2. **Clone your repository**:
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-username/mindcare.git
   sudo chown -R ubuntu:ubuntu mindcare
   ```

3. **Run EC2 setup script**:
   ```bash
   cd mindcare
   chmod +x deploy/ec2-setup.sh
   ./deploy/ec2-setup.sh
   ```

4. **Configure RDS connection**:
   ```bash
   # Update the RDS endpoint in rds-setup.sh
   nano deploy/rds-setup.sh
   
   # Run RDS setup
   chmod +x deploy/rds-setup.sh
   ./deploy/rds-setup.sh
   ```

5. **Deploy the application**:
   ```bash
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

## Cost Estimation

Monthly costs (us-east-1):
- **EC2 t3.medium**: ~$30/month
- **RDS db.t3.micro**: ~$15/month
- **EBS Storage**: ~$2/month
- **Data Transfer**: ~$1-5/month
- **Total**: ~$50-55/month

## Security Considerations

1. **Database Security**:
   - RDS is in private subnet
   - Only accessible from EC2
   - Encryption enabled
   - Regular backups

2. **Network Security**:
   - VPC isolation
   - Security groups with minimal access
   - No direct internet access to RDS

3. **Application Security**:
   - HTTPS with Let's Encrypt
   - Security headers configured
   - JWT authentication

## Troubleshooting

### Common Issues

1. **AMI not found**: Update the AMI ID for your region
2. **Key pair not found**: Create a key pair in AWS console
3. **RDS connection failed**: Check security group rules
4. **SSL certificate issues**: Ensure domain points to EC2 IP

### Useful Commands

```bash
# Check EC2 status
terraform show | grep -A 10 aws_instance

# Check RDS status
terraform show | grep -A 10 aws_db_instance

# Destroy infrastructure
terraform destroy

# Update specific resource
terraform apply -target=aws_instance.mindcare_server
```

## Cleanup

To remove all resources:

```bash
terraform destroy
```

**Warning**: This will delete all data in the RDS instance! 