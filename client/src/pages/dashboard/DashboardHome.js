import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getUserProfile, selectUser, selectAuthLoading } from '../../store/slices/authSlice';
import PatientDashboard from './patient/PatientDashboard';
import PsychiatristDashboard from './psychiatrist/PsychiatristDashboard';

export default function DashboardHome() {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    // Fetch user profile if not already loaded
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  // Show loading state while fetching user data
  if (authLoading || !user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Loading Dashboard...</h2>
      </div>
    );
  }

  // Check if user is approved (if approval status is implemented)
  if (user.approvalStatus === 'pending') {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Account Pending Approval</h2>
        <p style={styles.text}>Your account is awaiting admin approval. Please check back later.</p>
      </div>
    );
  }

  // Route based on user role
  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'psychiatrist':
      return <PsychiatristDashboard />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return (
        <div style={styles.container}>
          <h2 style={styles.heading}>Invalid Role</h2>
          <p style={styles.text}>Your account role is not recognized. Please contact support.</p>
        </div>
      );
  }
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.8rem', color: '#6a1b9a', marginBottom: '10px' },
  text: { color: '#444', marginBottom: '30px' },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  card: {
    flex: '1 1 300px',
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #eee'
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: '#333',
    marginBottom: '15px',
    marginTop: 0
  },
  cardText: {
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.4'
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sessionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    fontSize: '14px'
  },
  sessionDate: {
    fontWeight: '500',
    color: '#6a1b9a'
  },
  sessionTime: {
    color: '#007bff'
  },
  sessionPsychiatrist: {
    color: '#28a745',
    fontSize: '12px'
  },
  resourceStats: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#6a1b9a'
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  profileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eee'
  },
  profileLabel: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  profileValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize'
  }
};
