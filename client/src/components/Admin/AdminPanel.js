import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  
  // Debug: Check token and user state
  const token = localStorage.getItem('token');
  console.log('AdminPanel - Token:', token);
  console.log('AdminPanel - Filter:', filter);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = filter === 'all' 
        ? '/api/admin/users' 
        : `/api/admin/users/${filter}`;
      
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleApprovalUpdate = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/approval`,
        { approvalStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh users list
      fetchUsers();
      fetchStats();
      
      // Show success message
      alert(`User ${newStatus} successfully`);
    } catch (err) {
      alert('Failed to update user status');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh users list
        fetchUsers();
        fetchStats();
        
        alert('User deleted successfully');
      } catch (err) {
        alert('Failed to delete user');
        console.error(err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      patient: 'role-patient',
      psychiatrist: 'role-psychiatrist',
      admin: 'role-admin'
    };
    
    return (
      <span className={`role-badge ${roleClasses[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="admin-panel-loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel - User Management</h2>
        
        {/* Stats Cards */}
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
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select 
          id="statusFilter"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Users Table */}
      <div className="users-table-container">
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
            {users.map(user => (
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
                          className="btn-approve"
                          onClick={() => handleApprovalUpdate(user._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleApprovalUpdate(user._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {user.approvalStatus === 'approved' && (
                      <button 
                        className="btn-reject"
                        onClick={() => handleApprovalUpdate(user._id, 'rejected')}
                      >
                        Revoke
                      </button>
                    )}
                    {user.approvalStatus === 'rejected' && (
                      <button 
                        className="btn-approve"
                        onClick={() => handleApprovalUpdate(user._id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="no-users">No users found for the selected filter.</div>
      )}
    </div>
  );
};

export default AdminPanel;
