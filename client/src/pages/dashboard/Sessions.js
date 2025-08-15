import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../../utils/api';
import axios from 'axios';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [psychiatrists, setPsychiatrists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    psychiatristId: '',
    date: '',
    time: '',
    duration: 60,
    sessionType: 'individual',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const user = useAppSelector(selectUser);
  const isPatient = user?.role === 'patient';

  useEffect(() => {
    fetchSessions();
    if (isPatient) {
      fetchPsychiatrists();
    }
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

  const fetchPsychiatrists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/sessions/psychiatrists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPsychiatrists(response.data);
    } catch (err) {
      console.error('Error fetching psychiatrists:', err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/sessions', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSessions([...sessions, response.data]);
      setShowBookingForm(false);
      setBookingData({
        psychiatristId: '',
        date: '',
        time: '',
        duration: 60,
        sessionType: 'individual',
        notes: ''
      });
      alert('Session booked successfully!');
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
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
      case 'pending': return '#ffc107';
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
      return ['scheduled', 'pending'].includes(session.status) && new Date(session.date) >= new Date();
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
      <div style={styles.header}>
        <h2 style={styles.heading}>Your Sessions</h2>
        {isPatient && (
          <button 
            style={styles.bookButton}
            onClick={() => setShowBookingForm(true)}
          >
            + Book Session
          </button>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Book a Session</h3>
            <form onSubmit={handleBookingSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Psychiatrist:</label>
                <select
                  style={styles.select}
                  value={bookingData.psychiatristId}
                  onChange={(e) => setBookingData({...bookingData, psychiatristId: e.target.value})}
                  required
                >
                  <option value="">Select a psychiatrist</option>
                  {psychiatrists.map(psych => (
                    <option key={psych.id} value={psych.id}>
                      {psych.name} {psych.specialty && `- ${psych.specialty}`}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date:</label>
                <input
                  type="date"
                  style={styles.input}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Time:</label>
                <input
                  type="time"
                  style={styles.input}
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Duration (minutes):</label>
                <select
                  style={styles.select}
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Session Type:</label>
                <select
                  style={styles.select}
                  value={bookingData.sessionType}
                  onChange={(e) => setBookingData({...bookingData, sessionType: e.target.value})}
                >
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="family">Family</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes (optional):</label>
                <textarea
                  style={styles.textarea}
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  placeholder="Any specific concerns or topics you'd like to discuss..."
                  rows={3}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Book Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
        <div style={styles.noSessions}>
          {isPatient ? 'No sessions found. Book your first session!' : 'No sessions found'}
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>{isPatient ? 'Psychiatrist' : 'Patient'}</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, i) => (
                <tr key={session.id} style={styles.row}>
                  <td style={styles.td}>{formatDate(session.date)}</td>
                  <td style={styles.td}>{formatTime(session.time)}</td>
                  <td style={styles.td}>
                    <div>
                      <div style={styles.psychiatristName}>
                        {isPatient 
                          ? (session.psychiatrist?.name || 'Unknown')
                          : (session.patient?.name || 'Unknown')
                        }
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  heading: { fontSize: '1.6rem', color: '#6a1b9a', margin: 0 },
  bookButton: {
    backgroundColor: '#6a1b9a',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalTitle: {
    margin: '0 0 20px 0',
    color: '#6a1b9a'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical'
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#6a1b9a',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer'
  },
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
