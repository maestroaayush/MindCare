import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', password: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setForm({ name: res.data.name, password: '' });
        setPreview(res.data.profilePic || '');
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

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (form.password) formData.append('password', form.password);
      if (profilePic) formData.append('profilePic', profilePic);

      const res = await axios.put('http://localhost:5000/api/auth/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(res.data);
      setEditMode(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Update failed. Try again.');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>

      <div style={styles.center}>
        <img
          src={preview || '/assets/default-user.png'}
          alt="Profile"
          style={styles.avatar}
        />
        {editMode && (
          <input type="file" onChange={handleFile} style={styles.inputFile} />
        )}
      </div>

      <div style={styles.infoBox}>
        {editMode ? (
          <>
            <label>Name:</label>
            <input name="name" value={form.name} onChange={handleChange} style={styles.input} />

            <label>New Password:</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} style={styles.input} />

            <button onClick={saveChanges} style={styles.button}>Save</button>
            <button onClick={() => setEditMode(false)} style={styles.cancel}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button onClick={() => setEditMode(true)} style={styles.button}>Edit Profile</button>
          </>
        )}
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    background: 'white',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#6a1b9a',
    fontSize: '1.8rem',
    marginBottom: '20px',
    textAlign: 'center'
  },
  infoBox: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#333',
    marginTop: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  inputFile: {
    margin: '10px 0'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#6a1b9a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px'
  },
  cancel: {
    padding: '10px 20px',
    backgroundColor: '#aaa',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  message: {
    marginTop: '10px',
    color: '#009688'
  },
  center: {
    textAlign: 'center'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px'
  }
};
