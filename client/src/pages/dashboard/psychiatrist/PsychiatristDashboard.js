import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserProfile, selectUser, selectAuthLoading } from '../../../store/slices/authSlice';
import { fetchSessions, selectSessions, selectSessionsLoading } from '../../../store/slices/sessionSlice';
import { fetchResources, selectResources } from '../../../store/slices/resourceSlice';

export default function PsychiatristDashboard() {
  const dispatch = useAppDispatch();

  // Redux selectors
  const user = useAppSelector(selectUser);
  const allSessions = useAppSelector(selectSessions);
  const resources = useAppSelector(selectResources);
  const authLoading = useAppSelector(selectAuthLoading);
  const sessionsLoading = useAppSelector(selectSessionsLoading);

  useEffect(() => {
    // Fetch all dashboard data
    if (!user) {
      dispatch(getUserProfile());
    }
    dispatch(fetchSessions());
    dispatch(fetchResources());
  }, [dispatch, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const resourcesCount = resources?.length || 0;
  const isLoading = authLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Loading Your Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome back, Dr. {user?.name}!</h2>
      <p style={styles.text}>Manage your sessions and resources to enhance patient care.</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Upcoming and Past Sessions</h3>
          {allSessions.length > 0 ? (
            <div>
              <p style={styles.cardText}>You have managed {allSessions.length} sessions:</p>
              <div style={styles.sessionsList}>
                {allSessions.slice(0, 3).map((session) => (
                  <div key={session._id} style={styles.sessionItem}>
                    <span style={styles.sessionDate}>{formatDate(session.date)}</span>
                    <span style={styles.sessionTime}>{session.time}</span>
                    <span style={styles.sessionPatient}>{session.patient?.name}</span>
                  </div>
                ))}
              </div>
              <button style={styles.primaryButton}>View All Sessions</button>
            </div>
          ) : (
            <div>
              <p style={styles.cardText}>No sessions to display.</p>
              <button style={styles.primaryButton}>Schedule New Session</button>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Available Resources for Patients</h3>
          <p style={styles.cardText}>
            Share {resourcesCount} helpful resources with your patients.
          </p>
          <div style={styles.resourceStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{resourcesCount}</span>
              <span style={styles.statLabel}>Patient Resources</span>
            </div>
          </div>
          <button style={styles.primaryButton}>Review Resources</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Activities</h3>
          <p style={styles.cardText}>Track your latest activities and interactions with patients.</p>
          <button style={styles.primaryButton}>View Activity Log</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <div style={styles.quickActions}>
            <button style={styles.actionButton}>Schedule Session</button>
            <button style={styles.actionButton}>Message Patient</button>
            <button style={styles.actionButton}>Update Availability</button>
            <button style={styles.actionButton}>Review Feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '2rem', color: '#003399', marginBottom: '10px' },
  text: { color: '#444', marginBottom: '30px', fontSize: '1.1rem' },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    flex: '1 1 300px',
    background: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #eee'
  },
  cardTitle: {
    fontSize: '1.3rem',
    color: '#333',
    marginBottom: '15px',
    marginTop: 0
  },
  cardText: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '15px'
  },
  sessionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px'
  },
  sessionDate: {
    fontWeight: '600',
    color: '#003399'
  },
  sessionTime: {
    color: '#007bff',
    fontWeight: '500'
  },
  sessionPatient: {
    color: '#28a745',
    fontSize: '13px',
    fontWeight: '500'
  },
  resourceStats: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    marginBottom: '15px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#003399'
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '5px'
  },
  primaryButton: {
    backgroundColor: '#0044cc',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    color: '#0044cc',
    border: '2px solid #0044cc',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
};

