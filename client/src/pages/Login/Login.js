import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loginUser,
  clearError,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '../../store/slices/authSlice';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      console.error('Login failed:', error);
    }
  };


  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-illustration">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f512.png" alt="Login" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <p className="login-subtitle">Welcome back to MindCare!</p>
          
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button 
            className="login-btn" 
            type="submit" 
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
          
          
          <div className="login-links">
            <Link to="/register">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
