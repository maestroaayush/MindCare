import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  // Debug logging
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - requiredRole:', requiredRole);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log('PrivateRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
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

export default PrivateRoute;
