import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserProfile, selectUser, selectAuthLoading } from '../../../store/slices/authSlice';
import { fetchUpcomingSessions, selectUpcomingSessions, selectSessionsLoading } from '../../../store/slices/sessionSlice';
import { fetchResources, selectTotal } from '../../../store/slices/resourceSlice';

export default function PatientDashboard() {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const user = useAppSelector(selectUser);
  const upcomingSessions = useAppSelector(selectUpcomingSessions);
  const resourcesCount = useAppSelector(selectTotal);
  const authLoading = useAppSelector(selectAuthLoading);
  const sessionsLoading = useAppSelector(selectSessionsLoading);

  useEffect(() => {
    // Fetch all dashboard data
    if (!user) {
      dispatch(getUserProfile());
    }
    dispatch(fetchUpcomingSessions());
    dispatch(fetchResources({ limit: 1 }));
  }, [dispatch, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
      <h2 style={styles.heading}>Welcome back, {user?.name}!</h2>
      <p style={styles.text}>Your mental health journey continues here. Track your progress and stay connected with your care team.</p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Upcoming Sessions</h3>
          {upcomingSessions.length > 0 ? (
            <div>
              <p style={styles.cardText}>You have {upcomingSessions.length} upcoming session{upcomingSessions.length > 1 ? 's' : ''}:</p>
              <div style={styles.sessionsList}>
                {upcomingSessions.slice(0, 3).map((session, index) => (
                  <div key={session._id} style={styles.sessionItem}>
                    <span style={styles.sessionDate}>{formatDate(session.date)}</span>
                    <span style={styles.sessionTime}>{session.time}</span>
                    <span style={styles.sessionPsychiatrist}>Dr. {session.psychiatrist?.name}</span>
                  </div>
                ))}
              </div>
              <button style={styles.primaryButton}>View All Sessions</button>
            </div>
          ) : (
            <div>
              <p style={styles.cardText}>No upcoming sessions scheduled.</p>
              <button style={styles.primaryButton}>Schedule New Session</button>
            </div>
          )}
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Self-Help Resources</h3>
          <p style={styles.cardText}>
            Access {resourcesCount} curated self-help materials, videos, and wellness tools.
          </p>
          <div style={styles.resourceStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{resourcesCount}</span>
              <span style={styles.statLabel}>Available Resources</span>
            </div>
          </div>
          <button style={styles.primaryButton}>Explore Resources</button>
        </div>
        
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your Progress</h3>
          <p style={styles.cardText}>Track your mental health journey and milestones.</p>
          <div style={styles.progressInfo}>
            <div style={styles.progressItem}>
              <span style={styles.progressLabel}>Sessions Completed:</span>
              <span style={styles.progressValue}>12</span>
            </div>
            <div style={styles.progressItem}>
              <span style={styles.progressLabel}>Days Active:</span>
              <span style={styles.progressValue}>45</span>
            </div>
            <div style={styles.progressItem}>
              <span style={styles.progressLabel}>Resources Used:</span>
              <span style={styles.progressValue}>8</span>
            </div>
          </div>
          <button style={styles.primaryButton}>View Full Report</button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <div style={styles.quickActions}>
            <button style={styles.actionButton}>Schedule Session</button>
            <button style={styles.actionButton}>Message Psychiatrist</button>
            <button style={styles.actionButton}>Mood Check-in</button>
            <button style={styles.actionButton}>Crisis Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '2rem', color: '#6a1b9a', marginBottom: '10px' },
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
    color: '#6a1b9a'
  },
  sessionTime: {
    color: '#007bff',
    fontWeight: '500'
  },
  sessionPsychiatrist: {
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
    color: '#6a1b9a'
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '5px'
  },
  progressInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '15px'
  },
  progressItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  progressLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  progressValue: {
    fontSize: '16px',
    color: '#6a1b9a',
    fontWeight: 'bold'
  },
  primaryButton: {
    backgroundColor: '#6a1b9a',
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
    color: '#6a1b9a',
    border: '2px solid #6a1b9a',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s'
  }
};
