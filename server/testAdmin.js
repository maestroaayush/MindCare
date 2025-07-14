const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

async function testAdmin() {
  try {
    // Test admin login
    console.log('Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@mindcare.com',
      password: 'admin123'
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.token;
    
    // Test admin stats endpoint
    console.log('\nTesting admin stats...');
    const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Stats response:', statsResponse.data);
    
    // Test admin users endpoint
    console.log('\nTesting admin users...');
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Users response:', usersResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAdmin();
