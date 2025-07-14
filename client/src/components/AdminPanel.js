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

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filter]);

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
        user._id === userId ? { ...user, approvalStatus: newStatus } : user
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
      await axios.delete(`/api/admin/users/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Remove from local state
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
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

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage user registrations and approvals</p>
      </div>

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

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Users Table */}
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
                  <tr key={user._id}>
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
                              onClick={() => handleApprovalUpdate(user._id, 'approved')}
                              className="btn-approve"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleApprovalUpdate(user._id, 'rejected')}
                              className="btn-reject"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {user.approvalStatus === 'approved' && (
                          <button 
                            onClick={() => handleApprovalUpdate(user._id, 'rejected')}
                            className="btn-reject"
                          >
                            Revoke
                          </button>
                        )}
                        {user.approvalStatus === 'rejected' && (
                          <button 
                            onClick={() => handleApprovalUpdate(user._id, 'approved')}
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
    </div>
  );
};

export default AdminPanel;
