import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  registerUser,
  clearError,
  clearRegistrationSuccess,
  selectAuthLoading,
  selectAuthError,
  selectRegistrationSuccess
} from '../store/slices/authSlice';
import './Login/Login.css';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const registrationSuccess = useAppSelector(selectRegistrationSuccess);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (registrationSuccess) {
      // Show success message and redirect to login after a delay
      setTimeout(() => {
        dispatch(clearRegistrationSuccess());
        navigate('/login');
      }, 2000);
    }
  }, [registrationSuccess, navigate, dispatch]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear Redux errors when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      await dispatch(registerUser(userData)).unwrap();
      // Success handling is done in useEffect
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-illustration">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f465.png" alt="Register" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <p className="login-subtitle">Create your MindCare account</p>
          
          {registrationSuccess && (
            <div className="login-success">
              Account created successfully! Redirecting to login...
            </div>
          )}
          
          {error && <div className="login-error">{error}</div>}
          
          <div className="login-field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {validationErrors.name && (
              <div className="field-error">{validationErrors.name}</div>
            )}
          </div>
          
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
            {validationErrors.email && (
              <div className="field-error">{validationErrors.email}</div>
            )}
          </div>
          
          <div className="login-field">
            <label htmlFor="role">I am a</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="patient">Patient - Seeking mental health support</option>
              <option value="psychiatrist">Psychiatrist - Mental health professional</option>
            </select>
          </div>
          
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                autoComplete="new-password"
                placeholder="Create a password (min 6 characters)"
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
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
          </div>
          
          <div className="login-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {validationErrors.confirmPassword && (
              <div className="field-error">{validationErrors.confirmPassword}</div>
            )}
          </div>
          
          <button className="login-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="login-links">
            <Link to="/login">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
