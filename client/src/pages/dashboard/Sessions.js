import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../../utils/api';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionsAPI.getAll();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') {
      return session.status === 'scheduled' && new Date(session.date) >= new Date();
    }
    if (filter === 'completed') {
      return session.status === 'completed';
    }
    return true;
  });

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Your Sessions</h2>
        <div style={styles.loading}>Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Your Sessions</h2>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Sessions</h2>
      
      {/* Filter buttons */}
      <div style={styles.filters}>
        <button 
          style={{
            ...styles.filterButton,
            backgroundColor: filter === 'all' ? '#6a1b9a' : '#f8f9fa',
            color: filter === 'all' ? 'white' : '#333'
          }}
          onClick={() => setFilter('all')}
        >
          All Sessions
        </button>
        <button 
          style={{
            ...styles.filterButton,
            backgroundColor: filter === 'upcoming' ? '#6a1b9a' : '#f8f9fa',
            color: filter === 'upcoming' ? 'white' : '#333'
          }}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          style={{
            ...styles.filterButton,
            backgroundColor: filter === 'completed' ? '#6a1b9a' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : '#333'
          }}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <div style={styles.noSessions}>No sessions found</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Psychiatrist</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, i) => (
                <tr key={session._id} style={styles.row}>
                  <td style={styles.td}>{formatDate(session.date)}</td>
                  <td style={styles.td}>{formatTime(session.time)}</td>
                  <td style={styles.td}>
                    <div>
                      <div style={styles.psychiatristName}>
                        {session.psychiatrist?.name || 'Unknown'}
                      </div>
                      {session.psychiatrist?.specialization && (
                        <div style={styles.specialization}>
                          {session.psychiatrist.specialization}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>{session.duration} min</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(session.status)
                    }}>
                      {getStatusText(session.status)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {session.sessionType ? session.sessionType.charAt(0).toUpperCase() + session.sessionType.slice(1) : 'Individual'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px' },
  heading: { fontSize: '1.6rem', color: '#6a1b9a', marginBottom: '20px' },
  loading: { textAlign: 'center', padding: '20px', color: '#666' },
  error: { textAlign: 'center', padding: '20px', color: '#d32f2f', backgroundColor: '#ffebee', borderRadius: '4px' },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  filterButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  noSessions: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontStyle: 'italic'
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerRow: {
    backgroundColor: '#f8f9fa'
  },
  th: {
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #dee2e6'
  },
  row: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '12px 15px',
    verticalAlign: 'middle'
  },
  psychiatristName: {
    fontWeight: '500',
    color: '#333'
  },
  specialization: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px'
  },
  statusBadge: {
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase'
  }
};
