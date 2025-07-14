const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkAdminUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check for existing admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('Existing admin users:');
    adminUsers.forEach(user => {
      console.log(`- Email: ${user.email}, Name: ${user.name}, Status: ${user.approvalStatus}`);
    });
    
    if (adminUsers.length === 0) {
      console.log('No admin users found.');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdminUsers();
