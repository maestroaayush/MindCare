import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>MindCare</h2>
        <nav>
          <ul style={styles.navList}>
            <li><Link to="/dashboard" style={styles.link}>Home</Link></li>
            <li><Link to="/dashboard/profile" style={styles.link}>Profile</Link></li>
            <li><Link to="/dashboard/sessions" style={styles.link}>Sessions</Link></li>
            <li><Link to="/dashboard/resources" style={styles.link}>Resources</Link></li>
            <li><Link to="/" style={styles.link}>Logout</Link></li>
          </ul>
        </nav>
      </aside>

      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh'
  },
  sidebar: {
    width: '220px',
    background: '#6a1b9a',
    color: 'white',
    padding: '20px 15px'
  },
  logo: {
    fontSize: '1.5rem',
    marginBottom: '30px'
  },
  navList: {
    listStyle: 'none',
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    padding: '10px 0',
    fontWeight: '500'
  },
  mainContent: {
    flex: 1,
    background: '#f4f6f8',
    padding: '30px'
  }
};
