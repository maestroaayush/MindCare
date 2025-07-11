import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }

    // In real app, send to backend or email service
    console.log('Form submitted:', form);
    setSuccess('Message sent successfully!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Contact Us</h2>
      <p style={styles.subtitle}>We'd love to hear from you. Reach out anytime.</p>

      <div style={styles.container}>
        <div style={styles.info}>
          <p><strong>Email:</strong> support@mindcare.com</p>
          <p><strong>Phone:</strong> +60 123-456-789</p>
          <p><strong>Location:</strong> Kuala Lumpur, Malaysia</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {success && <p style={styles.success}>{success}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            style={{ ...styles.input, resize: 'vertical' }}
          />

          <button type="submit" style={styles.button}>Send Message</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#f9f9f9',
    padding: '60px 20px',
    minHeight: '100vh',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.2rem',
    color: '#6a1b9a',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '40px'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px'
  },
  info: {
    flex: '1 1 250px',
    textAlign: 'left',
    fontSize: '1.1rem',
    color: '#333'
  },
  form: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  button: {
    padding: '12px',
    backgroundColor: '#6a1b9a',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  success: {
    color: 'green',
    marginBottom: '10px'
  },
  error: {
    color: 'red',
    marginBottom: '10px'
  }
};
