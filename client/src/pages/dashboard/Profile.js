import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', password: '', bio: '', phone: '', location: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setForm({ 
          name: res.data.name || '', 
          password: '',
          bio: res.data.bio || '',
          phone: res.data.phone || '',
          location: res.data.location || ''
        });
      } catch (err) {
        setMessage('Failed to load profile.');
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      formData.append('phone', form.phone);
      formData.append('location', form.location);
      
      if (form.password) formData.append('password', form.password);

      const res = await axios.put('/api/auth/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(res.data);
      setEditMode(false);
      setShowChangePassword(false);
      setMessage('Profile updated successfully!');
      
      // Reset form password
      setForm({ ...form, password: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="enhanced-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <i className="fas fa-user-circle profile-avatar-large"></i>
            </div>
            
            <div className="profile-header-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-role">
                <i className="fas fa-user-tag"></i>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p className="profile-join-date">
                <i className="fas fa-calendar-alt"></i>
                Member since {user.createdAt ? formatJoinDate(user.createdAt) : 'N/A'}
              </p>
            </div>
            
            <div className="profile-actions">
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)} 
                  className="btn-primary-outline"
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    onClick={saveChanges} 
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setEditMode(false);
                      setShowChangePassword(false);
                      setForm({ 
                        name: user.name || '', 
                        password: '',
                        bio: user.bio || '',
                        phone: user.phone || '',
                        location: user.location || ''
                      });
                    }} 
                    className="btn-secondary"
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`profile-message ${message.includes('success') ? 'success' : 'error'}`}>
          <i className={`fas ${message.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {message}
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <i className="fas fa-user"></i>
            Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="fas fa-shield-alt"></i>
            Security
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="fas fa-cog"></i>
            Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="personal-info-section">
              <h3>Personal Information</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-user"></i>
                    Full Name
                  </label>
                  {editMode ? (
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="form-value">{user.name || 'Not specified'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <p className="form-value email-value">{user.email}</p>
                  <small className="form-note">Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-phone"></i>
                    Phone Number
                  </label>
                  {editMode ? (
                    <input 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                      className="form-input"
                      placeholder="Enter your phone number"
                      type="tel"
                    />
                  ) : (
                    <p className="form-value">{user.phone || 'Not specified'}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-map-marker-alt"></i>
                    Location
                  </label>
                  {editMode ? (
                    <input 
                      name="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      className="form-input"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="form-value">{user.location || 'Not specified'}</p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <i className="fas fa-info-circle"></i>
                    Bio
                  </label>
                  {editMode ? (
                    <textarea 
                      name="bio" 
                      value={form.bio} 
                      onChange={handleChange} 
                      className="form-textarea"
                      placeholder="Tell us about yourself..."
                      rows="4"
                    />
                  ) : (
                    <p className="form-value bio-value">{user.bio || 'No bio available'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <h3>Security Settings</h3>
              
              <div className="security-card">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Password</h4>
                    <p>Last updated: Recently</p>
                  </div>
                  <button 
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="btn-secondary"
                  >
                    <i className="fas fa-key"></i>
                    Change Password
                  </button>
                </div>

                {showChangePassword && (
                  <div className="password-change-form">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input 
                        name="password" 
                        type="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        className="form-input"
                        placeholder="Enter new password"
                        minLength="6"
                      />
                      <small className="form-note">Password must be at least 6 characters long</small>
                    </div>
                  </div>
                )}

                <div className="security-item">
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-secondary" disabled>
                    <i className="fas fa-mobile-alt"></i>
                    Enable 2FA (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-section">
              <h3>Account Preferences</h3>
              
              <div className="preferences-card">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your appointments and messages</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>SMS Notifications</h4>
                    <p>Get SMS reminders for upcoming sessions</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Privacy Mode</h4>
                    <p>Hide your online status from other users</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
