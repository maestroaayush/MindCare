require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema (same as in your models)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'psychiatrist', 'admin'],
    required: true,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@mindcare.com' });
    if (existingAdmin) {
      console.log('Admin user already exists with email: admin@mindcare.com');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@mindcare.com',
      password: hashedPassword,
      role: 'admin',
      approvalStatus: 'approved' // Admin is automatically approved
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@mindcare.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('Status: approved');
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
