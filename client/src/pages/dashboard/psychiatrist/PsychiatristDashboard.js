import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserProfile, selectUser, selectAuthLoading } from '../../../store/slices/authSlice';
import { fetchSessions, selectSessions, selectSessionsLoading } from '../../../store/slices/sessionSlice';
import { fetchResources, selectResources } from '../../../store/slices/resourceSlice';
import './PsychiatristDashboard.css';

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
      <div className="psychiatrist-container">
        <h2 className="dashboard-heading">Loading Your Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="psychiatrist-container">
      <h2 className="dashboard-heading">Welcome back, Dr. {user?.name}!</h2>
      <p className="dashboard-text">Manage your sessions and resources to enhance patient care.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3 className="card-title">Upcoming and Past Sessions</h3>
          {allSessions.length > 0 ? (
            <div>
              <p className="card-text">You have managed {allSessions.length} sessions:</p>
              <div className="sessions-list">
                {allSessions.slice(0, 3).map((session) => (
                  <div key={session._id} className="session-item">
                    <span className="session-date">{formatDate(session.date)}</span>
                    <span className="session-time">{session.time}</span>
                    <span className="session-patient">{session.patient?.name}</span>
                  </div>
                ))}
              </div>
              <button className="psychiatrist-primary-button">View All Sessions</button>
            </div>
          ) : (
            <div>
              <p className="card-text">No sessions to display.</p>
              <button className="psychiatrist-primary-button">Schedule New Session</button>
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Available Resources for Patients</h3>
          <p className="card-text">
            Share {resourcesCount} helpful resources with your patients.
          </p>
          <div className="resource-stats">
            <div className="stat-item">
              <span className="stat-number">{resourcesCount}</span>
              <span className="stat-label">Patient Resources</span>
            </div>
          </div>
          <button className="psychiatrist-primary-button">Review Resources</button>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Recent Activities</h3>
          <p className="card-text">Track your latest activities and interactions with patients.</p>
          <button className="psychiatrist-primary-button">View Activity Log</button>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="psychiatrist-action-button">Schedule Session</button>
            <button className="psychiatrist-action-button">Message Patient</button>
            <button className="psychiatrist-action-button">Update Availability</button>
            <button className="psychiatrist-action-button">Review Feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
}


