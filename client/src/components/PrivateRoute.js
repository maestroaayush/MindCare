import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  
  // Debug logging
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - requiredRole:', requiredRole);
  
  // If not authenticated or no token, redirect to login
  if (!isAuthenticated || !token) {
    console.log('PrivateRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If we have a token but no user yet, this means the user is still being fetched
  // The AuthWrapper will handle this case
  if (!user) {
    console.log('PrivateRoute - User data still loading');
    return (
      <div style={loadingStyles.container}>
        <div style={loadingStyles.spinner}></div>
        <h2 style={loadingStyles.text}>Loading...</h2>
        <p style={loadingStyles.subtext}>Fetching user information...</p>
      </div>
    );
  }

  // Check if user account is approved
  if (user.approvalStatus !== 'approved') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Account Pending Approval</h2>
        <p>Your account is pending admin approval. Please wait for approval before accessing this page.</p>
      </div>
    );
  }

  // Check if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page. Required role: {requiredRole}, Your role: {user.role}</p>
      </div>
    );
  }

  return children;
};

const loadingStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  text: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '10px 0',
    textAlign: 'center'
  },
  subtext: {
    fontSize: '0.9rem',
    opacity: 0.8,
    textAlign: 'center',
    margin: '5px 0'
  }
};

export default PrivateRoute;
