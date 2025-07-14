import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { useSidebarData } from '../hooks/useSidebarData';
import DashboardHeader from './DashboardHeader';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { upcomingSessionsCount, unreadMessagesCount, totalNotifications } = useSidebarData();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);


  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Check if link is active
  const isLinkActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const routeTitles = {
      '/dashboard': 'Dashboard',
      '/dashboard/profile': 'Profile',
      '/dashboard/sessions': 'Sessions',
      '/dashboard/resources': 'Resources',
      '/dashboard/mood-tracker': 'Mood Tracker',
      '/dashboard/goals': 'Goals',
      '/dashboard/messages': 'Messages'
    };
    return routeTitles[path] || 'Dashboard';
  };

  // Get breadcrumbs for current route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    if (pathSegments.length <= 1) return [];
    
    const breadcrumbs = ['Dashboard'];
    if (pathSegments[1]) {
      const secondSegment = pathSegments[1];
      const formattedSegment = secondSegment.charAt(0).toUpperCase() + secondSegment.slice(1).replace('-', ' ');
      breadcrumbs.push(formattedSegment);
    }
    
    return breadcrumbs;
  };

  // Navigation items with enhanced properties
  const navigationItems = [
    {
      section: 'Main',
      items: [
        {
          path: '/dashboard',
          icon: '🏠',
          text: 'Dashboard',
          exact: true,
          tooltip: 'Overview of your mental health journey'
        },
        {
          path: '/dashboard/profile',
          icon: '👤',
          text: 'Profile',
          tooltip: 'Manage your personal information and preferences',
          isEnhanced: true,
          keyboardShortcut: 'P'
        }
      ]
    },
    {
      section: 'Health',
      items: [
        {
          path: '/dashboard/sessions',
          icon: '💬',
          text: 'Sessions',
          badge: upcomingSessionsCount > 0 ? upcomingSessionsCount : null,
          badgeType: upcomingSessionsCount > 0 ? 'urgent' : null,
          tooltip: `Manage your therapy sessions${upcomingSessionsCount > 0 ? ` (${upcomingSessionsCount} upcoming)` : ''}`,
          isEnhanced: true,
          keyboardShortcut: 'S'
        },
        {
          path: '/dashboard/resources',
          icon: '📚',
          text: 'Resources',
          tooltip: 'Access helpful materials and educational content',
          isEnhanced: true,
          keyboardShortcut: 'R',
          badge: 'NEW'
        }
      ]
    },
    {
      section: 'Tools',
      items: [
        {
          path: '/dashboard/mood-tracker',
          icon: '📊',
          text: 'Mood Tracker'
        },
        {
          path: '/dashboard/goals',
          icon: '🎯',
          text: 'Goals'
        },
        {
          path: '/dashboard/messages',
          icon: '💌',
          text: 'Messages',
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
        }
      ]
    }
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Enhanced Sidebar */}
      <aside className={`enhanced-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h1 className="sidebar-logo">MindCare</h1>
          
          {/* User Info */}
          <div className="sidebar-user">
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-role">{user?.role || 'patient'}</p>
            </div>
            <div className="status-indicator"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              <h3 className="nav-section-title">{section.section}</h3>
              <ul className="nav-list">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link ${isLinkActive(item.path) ? 'active' : ''} ${item.isEnhanced ? 'enhanced' : ''}`}
                      title={item.tooltip}
                      aria-label={item.tooltip}
                      data-keyboard-shortcut={item.keyboardShortcut}
                      tabIndex={0}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.text}</span>
                      {item.badge && (
                        <span className={`nav-badge ${item.badgeType || 'default'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.keyboardShortcut && (
                        <span className="keyboard-shortcut" aria-hidden="true">
                          {item.keyboardShortcut}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1 className="mobile-title">MindCare</h1>
          <div></div> {/* Spacer */}
        </div>

        {/* Dashboard Header */}
        <DashboardHeader 
          pageTitle={getPageTitle()}
          breadcrumbs={getBreadcrumbs()}
        />

        {/* Content Wrapper */}
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
