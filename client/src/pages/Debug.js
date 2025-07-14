import React, { useState } from 'react';

export default function Debug() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test 1: Server connection
      const healthCheck = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' })
      });
      
      setResult(prev => prev + '\n✅ Server is responding');
      
      // Test 2: Sample login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'john.doe@email.com', 
          password: 'password123' 
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        setResult(prev => prev + '\n✅ Login successful!');
        setResult(prev => prev + `\n   Token: ${loginData.token.substring(0, 20)}...`);
        setResult(prev => prev + `\n   User: ${loginData.user.name} (${loginData.user.role})`);
      } else {
        setResult(prev => prev + '\n❌ Login failed:');
        setResult(prev => prev + `\n   Error: ${JSON.stringify(loginData)}`);
      }
      
    } catch (error) {
      setResult(prev => prev + `\n❌ Network error: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testReduxLogin = async () => {
    setLoading(true);
    setResult('Testing Redux login...');
    
    try {
      // Import the Redux action
      const { loginUser } = await import('../store/slices/authSlice');
      const { store } = await import('../store/store');
      
      const credentials = {
        email: 'john.doe@email.com',
        password: 'password123'
      };
      
      const action = await store.dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(action)) {
        setResult(prev => prev + '\n✅ Redux login successful!');
        setResult(prev => prev + `\n   User: ${action.payload.user.name}`);
      } else {
        setResult(prev => prev + '\n❌ Redux login failed:');
        setResult(prev => prev + `\n   Error: ${action.payload || action.error.message}`);
      }
      
    } catch (error) {
      setResult(prev => prev + `\n❌ Redux error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>MindCare Login Debug Tool</h2>
      
      <div style={styles.buttons}>
        <button 
          onClick={testAPI} 
          disabled={loading}
          style={styles.button}
        >
          Test Direct API
        </button>
        
        <button 
          onClick={testReduxLogin} 
          disabled={loading}
          style={styles.button}
        >
          Test Redux Login
        </button>
      </div>
      
      <div style={styles.result}>
        <h3>Results:</h3>
        <pre>{result || 'Click a button to test'}</pre>
      </div>
      
      <div style={styles.info}>
        <h3>Sample Credentials:</h3>
        <p><strong>Patients:</strong></p>
        <ul>
          <li>john.doe@email.com / password123</li>
          <li>alice.smith@email.com / password123</li>
        </ul>
        <p><strong>Psychiatrists:</strong></p>
        <ul>
          <li>maya.singh@mindcare.com / password123</li>
          <li>ali.tan@mindcare.com / password123</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#6a1b9a',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  result: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px'
  },
  info: {
    backgroundColor: '#e8f5e8',
    padding: '15px',
    borderRadius: '5px'
  }
};
