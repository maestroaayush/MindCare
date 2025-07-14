import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, logoutUser } from '../store/slices/authSlice';
import { useSidebarData } from '../hooks/useSidebarData';
import './DashboardHeader.css';

const DashboardHeader = ({ pageTitle, breadcrumbs = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { totalNotifications } = useSidebarData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'session',
      title: 'Upcoming Session',
      message: 'Your session with Dr. Smith is in 1 hour',
      time: '1h',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from your therapist',
      time: '2h',
      unread: true
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Mood Check-in',
      message: 'Don\'t forget to log your mood for today',
      time: '3h',
      unread: false
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="dashboard-header-bar">
      <div className="header-left">
        <div className="page-info">
          <h1 className="page-title">{pageTitle || 'Dashboard'}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="breadcrumb">
                  {crumb}
                  {index < breadcrumbs.length - 1 && <span className="separator">›</span>}
                </span>
              ))}
            </nav>
          )}
        </div>
        <div className="date-time">
          <div className="current-time">{formatTime()}</div>
          <div className="current-date">{formatDate()}</div>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" title="Schedule Session">
            <span className="icon">📅</span>
          </button>
          <button className="quick-action-btn" title="Quick Note">
            <span className="icon">📝</span>
          </button>
          <button className="quick-action-btn" title="Mood Check-in">
            <span className="icon">😊</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="notifications-container">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="icon">🔔</span>
            {totalNotifications > 0 && (
              <span className="notification-badge">{totalNotifications}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="close-btn" onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-container">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-greeting">{getGreeting()}</div>
              <div className="user-name">{user?.name || 'User'}</div>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-details">
                  <div className="user-avatar large">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email || 'user@example.com'}</div>
                    <div className="user-role">{user?.role || 'Patient'}</div>
                  </div>
                </div>
              </div>
              <div className="dropdown-menu">
                <button className="menu-item">
                  <span className="menu-icon">👤</span>
                  <span>Profile Settings</span>
                </button>
                <button className="menu-item">
                  <span className="menu-icon">⚙️</span>
                  <span>Account Settings</span>
                </button>
                <button className="menu-item">
                  <span className="menu-icon">🔐</span>
                  <span>Privacy & Security</span>
                </button>
                <button className="menu-item">
                  <span className="menu-icon">❓</span>
                  <span>Help & Support</span>
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item">
                  <span className="menu-icon">🌙</span>
                  <span>Dark Mode</span>
                  <span className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </span>
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item logout-menu-item" onClick={handleLogout}>
                  <span className="menu-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="dropdown-overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default DashboardHeader;
