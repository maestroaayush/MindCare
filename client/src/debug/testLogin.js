// Simple test script to debug login functionality
const API_BASE_URL = '/api';

const testLogin = async () => {
  try {
    console.log('Testing login with sample credentials...');
    
    const credentials = {
      email: 'john.doe@email.com',
      password: 'password123'
    };
    
    console.log('Sending request to:', `${API_BASE_URL}/auth/login`);
    console.log('Credentials:', credentials);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token);
      console.log('User:', data.user);
    } else {
      console.log('❌ Login failed');
      console.log('Error:', data);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Test with different credentials
const testMultipleLogins = async () => {
  const testCases = [
    { email: 'john.doe@email.com', password: 'password123' },
    { email: 'maya.singh@mindcare.com', password: 'password123' },
    { email: 'invalid@email.com', password: 'wrong' }
  ];
  
  for (const credentials of testCases) {
    console.log(`\n--- Testing: ${credentials.email} ---`);
    await testLogin(credentials);
  }
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testLogin = testLogin;
  window.testMultipleLogins = testMultipleLogins;
  console.log('Debug functions available: testLogin(), testMultipleLogins()');
}

export { testLogin, testMultipleLogins };
