import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Contact messages state
  const [contactMessages, setContactMessages] = useState([]);
  const [contactStats, setContactStats] = useState({});
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState('');
  const [contactFilter, setContactFilter] = useState('all');
  const [showContactDeleteModal, setShowContactDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filter]);
  
  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContactMessages();
      fetchContactStats();
    }
  }, [activeTab, contactFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' ? '/api/admin/users' : `/api/admin/users/${filter}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleApprovalUpdate = async (userId, newStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/approval`, 
        { approvalStatus: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, approvalStatus: newStatus } : user
      ));
      
      // Refresh stats
      fetchStats();
      
      // Show success message
      alert(`User ${newStatus} successfully!`);
    } catch (err) {
      alert('Failed to update user approval status');
      console.error('Error updating approval:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await axios.delete(`/api/admin/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Remove from local state
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Refresh stats
      fetchStats();
      
      // Close modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected'
    };
    return <span className={`badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      patient: 'badge-patient',
      psychiatrist: 'badge-psychiatrist',
      admin: 'badge-admin'
    };
    return <span className={`badge ${roleClasses[role]}`}>{role.toUpperCase()}</span>;
  };

  // Contact message functions
  const fetchContactMessages = async () => {
    try {
      setContactLoading(true);
      const endpoint = contactFilter === 'all' ? '/api/admin/contact-messages' : `/api/admin/contact-messages?status=${contactFilter}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setContactMessages(response.data);
      setContactError('');
    } catch (err) {
      setContactError('Failed to fetch contact messages');
      console.error('Error fetching contact messages:', err);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchContactStats = async () => {
    try {
      const response = await axios.get('/api/admin/contact-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setContactStats(response.data);
    } catch (err) {
      console.error('Error fetching contact stats:', err);
    }
  };

  const handleContactStatusUpdate = async (messageId, newStatus) => {
    try {
      await axios.put(`/api/admin/contact-messages/${messageId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Update local state
      setContactMessages(contactMessages.map(message => 
        message.id === messageId ? { ...message, status: newStatus } : message
      ));
      
      // Refresh stats
      fetchContactStats();
      
      alert(`Message status updated to ${newStatus}!`);
    } catch (err) {
      alert('Failed to update message status');
      console.error('Error updating message status:', err);
    }
  };

  const handleDeleteContactMessage = async () => {
    if (!contactToDelete) return;
    
    try {
      await axios.delete(`/api/admin/contact-messages/${contactToDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Remove from local state
      setContactMessages(contactMessages.filter(message => message.id !== contactToDelete.id));
      
      // Refresh stats
      fetchContactStats();
      
      // Close modal
      setShowContactDeleteModal(false);
      setContactToDelete(null);
      
      alert('Contact message deleted successfully!');
    } catch (err) {
      alert('Failed to delete contact message');
      console.error('Error deleting contact message:', err);
    }
  };

  const getContactStatusBadge = (status) => {
    const statusClasses = {
      unread: 'badge-unread',
      read: 'badge-read',
      responded: 'badge-responded'
    };
    return <span className={`badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage user registrations and contact messages</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Messages
          {contactStats.unreadMessages > 0 && (
            <span className="notification-badge">
              {contactStats.unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Approvals</h3>
              <p className="stat-number">{stats.pendingUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Approved Users</h3>
              <p className="stat-number">{stats.approvedUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Rejected Users</h3>
              <p className="stat-number">{stats.rejectedUsers || 0}</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <label>Filter by Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Users</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={fetchUsers} className="btn-refresh">
              Refresh
            </button>
          </div>
        </>
      )}

      {/* Contact Messages Tab */}
      {activeTab === 'contacts' && (
        <>
          {/* Contact Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Messages</h3>
              <p className="stat-number">{contactStats.totalMessages || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Unread Messages</h3>
              <p className="stat-number">{contactStats.unreadMessages || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Read Messages</h3>
              <p className="stat-number">{contactStats.readMessages || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Responded Messages</h3>
              <p className="stat-number">{contactStats.respondedMessages || 0}</p>
            </div>
          </div>

          {/* Contact Filter Controls */}
          <div className="filter-controls">
            <label>Filter by Status:</label>
            <select value={contactFilter} onChange={(e) => setContactFilter(e.target.value)}>
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="responded">Responded</option>
            </select>
            <button onClick={fetchContactMessages} className="btn-refresh">
              Refresh
            </button>
          </div>
        </>
      )}

      {/* Error Messages */}
      {error && <div className="error-message">{error}</div>}
      {contactError && <div className="error-message">{contactError}</div>}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="users-table-container">
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-users">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.approvalStatus)}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          {user.approvalStatus === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApprovalUpdate(user.id, 'approved')}
                                className="btn-approve"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleApprovalUpdate(user.id, 'rejected')}
                                className="btn-reject"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user.approvalStatus === 'approved' && (
                            <button 
                              onClick={() => handleApprovalUpdate(user.id, 'rejected')}
                              className="btn-reject"
                            >
                              Revoke
                            </button>
                          )}
                          {user.approvalStatus === 'rejected' && (
                            <button 
                              onClick={() => handleApprovalUpdate(user.id, 'approved')}
                              className="btn-approve"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Contact Messages Table */}
      {activeTab === 'contacts' && (
        <div className="contacts-table-container">
          {contactLoading ? (
            <div className="loading">Loading contact messages...</div>
          ) : (
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-messages">
                      No contact messages found
                    </td>
                  </tr>
                ) : (
                  contactMessages.map(message => (
                    <tr key={message.id}>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td className="message-content">
                        {message.message.length > 50 
                          ? `${message.message.substring(0, 50)}...` 
                          : message.message}
                      </td>
                      <td>{getContactStatusBadge(message.status)}</td>
                      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          {message.status === 'unread' && (
                            <>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'read')}
                                className="btn-read"
                              >
                                Mark Read
                              </button>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'responded')}
                                className="btn-respond"
                              >
                                Mark Responded
                              </button>
                            </>
                          )}
                          {message.status === 'read' && (
                            <>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'unread')}
                                className="btn-unread"
                              >
                                Mark Unread
                              </button>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'responded')}
                                className="btn-respond"
                              >
                                Mark Responded
                              </button>
                            </>
                          )}
                          {message.status === 'responded' && (
                            <>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'read')}
                                className="btn-read"
                              >
                                Mark Read
                              </button>
                              <button 
                                onClick={() => handleContactStatusUpdate(message.id, 'unread')}
                                className="btn-unread"
                              >
                                Mark Unread
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => {
                              setContactToDelete(message);
                              setShowContactDeleteModal(true);
                            }}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete user "{userToDelete?.name}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Message Delete Confirmation Modal */}
      {showContactDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this contact message from "{contactToDelete?.name}"?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowContactDeleteModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleDeleteContactMessage} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
