module.exports = {
  apps: [
    {
      name: 'mindcare-backend',
      script: 'index.js',
      cwd: '/var/www/mindcare/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: '/var/log/mindcare/backend-error.log',
      out_file: '/var/log/mindcare/backend-out.log',
      log_file: '/var/log/mindcare/backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-ec2-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/mindcare.git',
      path: '/var/www/mindcare',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 