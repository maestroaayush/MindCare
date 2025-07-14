import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // Dispatch logout action which will clear Redux state and localStorage
    dispatch(logout());
    
    // Redirect to home page
    navigate('/');
  };

  // Scroll to services section if on home, else navigate to home and scroll after navigation
  const handleServicesClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById('services-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If not on home, let Link navigate to home with hash, Home.js will handle scroll
  };

  return (
    <nav className="navbar">
      <div className="logo">MindCare</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <Link
            to={location.pathname === '/' ? '#' : '/#services'}
            onClick={handleServicesClick}
          >
            Services
          </Link>
        </li>
        <li><Link to="/contact">Contact</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}