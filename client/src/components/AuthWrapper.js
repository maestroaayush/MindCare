import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, selectAuth, selectAuthLoading, clearAuthState } from '../store/slices/authSlice';

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector(selectAuth);
  const isLoading = useSelector(selectAuthLoading);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken && !user) {
        try {
          // If we have a token but no user, fetch the profile
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          // If profile fetch fails, token might be invalid
          dispatch(clearAuthState());
          console.error('Token validation failed:', error);
        }
      }
      
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, user]);

  // Show loading spinner during initialization
  if (isInitializing || (isAuthenticated && !user && isLoading)) {
    return (
      <div style={loadingStyles.container}>
        <div style={loadingStyles.spinner}></div>
        <h2 style={loadingStyles.text}>Loading...</h2>
        <p style={loadingStyles.subtext}>Please wait while we verify your authentication</p>
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
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  text: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '10px 0',
    textAlign: 'center'
  },
  subtext: {
    fontSize: '1rem',
    opacity: 0.8,
    textAlign: 'center',
    margin: '5px 0'
  }
};

// Add the spinner animation to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AuthWrapper;
