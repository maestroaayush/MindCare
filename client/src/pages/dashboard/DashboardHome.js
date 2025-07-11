import React from 'react';

export default function DashboardHome() {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to Your Dashboard</h2>
      <p style={styles.text}>Here’s a quick overview of your mental health support tools.</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Upcoming Sessions</h3>
          <p>Check your scheduled appointments and session history.</p>
        </div>
        <div style={styles.card}>
          <h3>Resources</h3>
          <p>Access curated self-help materials and videos.</p>
        </div>
        <div style={styles.card}>
          <h3>Profile</h3>
          <p>Edit your information and manage your account.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.8rem', color: '#6a1b9a' },
  text: { color: '#444', marginBottom: '20px' },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    flex: '1 1 250px',
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
};
