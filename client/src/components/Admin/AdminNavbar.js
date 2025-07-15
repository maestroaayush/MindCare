import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-nav-container">
        <div className="admin-logo">
          <Link to="/">MindCare</Link>
          <span className="admin-badge">Admin</span>
        </div>
        
        <div className="admin-nav-links">
          <Link to="/dashboard" className="admin-nav-link">
            Dashboard
          </Link>
          <Link to="/" className="admin-nav-link">
            Home
          </Link>
          
          <div className="admin-user-section">
            <span className="admin-username">Welcome, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
