import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getUserProfile, selectUser, selectAuthLoading } from '../../../store/slices/authSlice';
import { fetchUpcomingSessions, selectUpcomingSessions, selectSessionsLoading } from '../../../store/slices/sessionSlice';
import { fetchResources, selectTotal } from '../../../store/slices/resourceSlice';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const dispatch = useAppDispatch();
  const [activeSection, setActiveSection] = useState('overview');
  const [showReminders, setShowReminders] = useState(true);
  const [moodData, setMoodData] = useState([]);
  const [progressData, setProgressData] = useState({});
  
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
    
    // Generate sample mood data
    generateMoodData();
    generateProgressData();
  }, [dispatch, user]);

  const generateMoodData = () => {
    const moods = [];
    const moodLabels = ['Excellent', 'Good', 'Okay', 'Poor', 'Terrible'];
    const moodValues = [5, 4, 3, 2, 1];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomMood = moodValues[Math.floor(Math.random() * moodValues.length)];
      moods.push({
        date: date.toISOString().split('T')[0],
        mood: randomMood,
        label: moodLabels[moodValues.indexOf(randomMood)]
      });
    }
    setMoodData(moods);
  };

  const generateProgressData = () => {
    setProgressData({
      sessionsCompleted: 12,
      daysActive: 45,
      resourcesUsed: 8,
      moodAverage: 3.8,
      streakDays: 7,
      goalsAchieved: 5
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMoodTrend = () => {
    if (moodData.length < 7) return 'neutral';
    const recent = moodData.slice(-7).reduce((sum, day) => sum + day.mood, 0) / 7;
    const previous = moodData.slice(-14, -7).reduce((sum, day) => sum + day.mood, 0) / 7;
    
    if (recent > previous + 0.3) return 'improving';
    if (recent < previous - 0.3) return 'declining';
    return 'stable';
  };

  const reminders = [
    {
      id: 1,
      type: 'session',
      title: 'Upcoming Session',
      message: 'Your session with Dr. Smith is tomorrow at 2:00 PM',
      priority: 'high',
      time: '2024-01-16T14:00:00'
    },
    {
      id: 2,
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your evening medication',
      priority: 'medium',
      time: '2024-01-15T20:00:00'
    },
    {
      id: 3,
      type: 'exercise',
      title: 'Daily Check-in',
      message: 'Don\'t forget to complete your mood check-in',
      priority: 'low',
      time: '2024-01-15T18:00:00'
    }
  ];

  const recommendedResources = [
    {
      id: 1,
      title: 'Mindfulness Meditation for Anxiety',
      type: 'video',
      duration: '15 min',
      rating: 4.8,
      reason: 'Based on your recent mood patterns'
    },
    {
      id: 2,
      title: 'Cognitive Behavioral Therapy Techniques',
      type: 'article',
      duration: '8 min read',
      rating: 4.9,
      reason: 'Recommended by your therapist'
    },
    {
      id: 3,
      title: 'Sleep Hygiene Guide',
      type: 'guide',
      duration: '12 min read',
      rating: 4.7,
      reason: 'To improve your sleep quality'
    }
  ];

  const isLoading = authLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Your Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-patient-dashboard" role="main" aria-label="Patient Dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Your mental health journey continues here. Track your progress and stay connected with your care team.</p>
        </div>
        
        <nav className="dashboard-nav" role="navigation" aria-label="Dashboard sections">
          <button 
            className={`nav-button ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
            aria-pressed={activeSection === 'overview'}
          >
            Overview
          </button>
          <button 
            className={`nav-button ${activeSection === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveSection('progress')}
            aria-pressed={activeSection === 'progress'}
          >
            Progress
          </button>
          <button 
            className={`nav-button ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveSection('resources')}
            aria-pressed={activeSection === 'resources'}
          >
            Resources
          </button>
        </nav>
      </header>

      {/* Reminders Section */}
      {showReminders && (
        <section className="reminders-section" aria-label="Reminders and notifications">
          <div className="reminders-header">
            <h2>🔔 Today's Reminders</h2>
            <button 
              className="close-reminders"
              onClick={() => setShowReminders(false)}
              aria-label="Close reminders"
            >
              ×
            </button>
          </div>
          <div className="reminders-list">
            {reminders.map(reminder => (
              <div key={reminder.id} className={`reminder-item ${reminder.priority}`}>
                <div className="reminder-content">
                  <h3>{reminder.title}</h3>
                  <p>{reminder.message}</p>
                </div>
                <div className="reminder-actions">
                  <button className="reminder-action">View</button>
                  <button className="reminder-dismiss">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="cards-grid">
              {/* Upcoming Sessions Card */}
              <div className="dashboard-card sessions-card">
                <div className="card-header">
                  <h3>📅 Upcoming Sessions</h3>
                  <span className="card-badge">{upcomingSessions.length}</span>
                </div>
                <div className="card-content">
                  {upcomingSessions.length > 0 ? (
                    <>
                      <div className="sessions-list">
                        {upcomingSessions.slice(0, 3).map((session, index) => (
                          <div key={session._id} className="session-item">
                            <div className="session-info">
                              <span className="session-date">{formatDate(session.date)}</span>
                              <span className="session-time">{session.time}</span>
                              <span className="session-doctor">Dr. {session.psychiatrist?.name}</span>
                            </div>
                            <div className="session-actions">
                              <button className="btn-secondary">Reschedule</button>
                              <button className="btn-primary">Join</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-outline">View All Sessions</button>
                    </>
                  ) : (
                    <div className="empty-state">
                      <p>No upcoming sessions scheduled.</p>
                      <button className="btn-primary">Schedule New Session</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mood Tracking Card */}
              <div className="dashboard-card mood-card">
                <div className="card-header">
                  <h3>😊 Mood Tracking</h3>
                  <span className={`trend-indicator ${getMoodTrend()}`}>
                    {getMoodTrend() === 'improving' ? '📈' : 
                     getMoodTrend() === 'declining' ? '📉' : '➡️'}
                  </span>
                </div>
                <div className="card-content">
                  <div className="mood-chart">
                    <div className="mood-bars">
                      {moodData.slice(-7).map((day, index) => (
                        <div key={index} className="mood-bar-container">
                          <div 
                            className="mood-bar"
                            style={{ height: `${day.mood * 20}%` }}
                            title={`${day.label} on ${day.date}`}
                          ></div>
                          <span className="mood-day">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mood-summary">
                    <p>Average this week: <strong>{(moodData.slice(-7).reduce((sum, day) => sum + day.mood, 0) / 7).toFixed(1)}/5</strong></p>
                    <p>Trend: <strong className={getMoodTrend()}>{getMoodTrend()}</strong></p>
                  </div>
                  <button className="btn-primary">Log Today's Mood</button>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="dashboard-card stats-card">
                <div className="card-header">
                  <h3>📊 Your Progress</h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">{progressData.sessionsCompleted}</span>
                      <span className="stat-label">Sessions Completed</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{progressData.streakDays}</span>
                      <span className="stat-label">Day Streak</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{progressData.goalsAchieved}</span>
                      <span className="stat-label">Goals Achieved</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{progressData.resourcesUsed}</span>
                      <span className="stat-label">Resources Used</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="dashboard-card actions-card">
                <div className="card-header">
                  <h3>⚡ Quick Actions</h3>
                </div>
                <div className="card-content">
                  <div className="quick-actions">
                    <button className="action-btn schedule">
                      <span className="action-icon">📅</span>
                      Schedule Session
                    </button>
                    <button className="action-btn message">
                      <span className="action-icon">💬</span>
                      Message Therapist
                    </button>
                    <button className="action-btn mood">
                      <span className="action-icon">😊</span>
                      Mood Check-in
                    </button>
                    <button className="action-btn crisis">
                      <span className="action-icon">🆘</span>
                      Crisis Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'progress' && (
          <div className="progress-section">
            <div className="progress-cards">
              {/* Detailed Progress Chart */}
              <div className="dashboard-card progress-chart-card">
                <div className="card-header">
                  <h3>📈 30-Day Mood Trend</h3>
                </div>
                <div className="card-content">
                  <div className="progress-chart">
                    <div className="chart-container">
                      {moodData.map((day, index) => (
                        <div key={index} className="chart-point">
                          <div 
                            className="chart-bar"
                            style={{ height: `${day.mood * 20}%` }}
                            title={`${day.label} on ${formatDate(day.date)}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="chart-labels">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals & Achievements */}
              <div className="dashboard-card goals-card">
                <div className="card-header">
                  <h3>🎯 Goals & Achievements</h3>
                </div>
                <div className="card-content">
                  <div className="goals-list">
                    <div className="goal-item completed">
                      <span className="goal-icon">✅</span>
                      <div className="goal-info">
                        <h4>Complete 10 sessions</h4>
                        <p>Achieved on Jan 12, 2024</p>
                      </div>
                    </div>
                    <div className="goal-item in-progress">
                      <span className="goal-icon">🔄</span>
                      <div className="goal-info">
                        <h4>7-day mood tracking streak</h4>
                        <p>7/7 days completed</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="goal-item pending">
                      <span className="goal-icon">⏳</span>
                      <div className="goal-info">
                        <h4>Use 15 resources</h4>
                        <p>8/15 completed</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '53%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'resources' && (
          <div className="resources-section">
            <div className="resources-header">
              <h2>📚 Recommended for You</h2>
              <p>Personalized resources based on your progress and preferences</p>
            </div>
            
            <div className="resources-grid">
              {recommendedResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <span className="resource-type">{resource.type}</span>
                    <div className="resource-rating">
                      <span className="stars">⭐</span>
                      <span>{resource.rating}</span>
                    </div>
                  </div>
                  <div className="resource-content">
                    <h3>{resource.title}</h3>
                    <p className="resource-duration">{resource.duration}</p>
                    <p className="resource-reason">{resource.reason}</p>
                  </div>
                  <div className="resource-actions">
                    <button className="btn-primary">Start Now</button>
                    <button className="btn-secondary">Save for Later</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="all-resources-section">
              <h3>All Resources ({resourcesCount})</h3>
              <button className="btn-outline">Explore All Resources</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
