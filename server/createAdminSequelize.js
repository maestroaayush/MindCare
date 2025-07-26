require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const sequelize = require('./config/database');

async function createAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@mindcare.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists with email: admin@mindcare.com');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@mindcare.com',
      password: hashedPassword,
      role: 'admin',
      approvalStatus: 'approved' // Admin is automatically approved
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@mindcare.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('Status: approved');
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdmin(); 