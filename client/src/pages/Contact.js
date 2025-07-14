import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess('Message sent successfully! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            We'd love to hear from you. Reach out anytime for support, questions, or feedback.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h2 className="contact-info-title">Get in Touch</h2>
            
            <div className="contact-info-item">
              <div className="contact-info-icon">📧</div>
              <div className="contact-info-content">
                <h4>Email</h4>
                <p>support@mindcare.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div className="contact-info-content">
                <h4>Phone</h4>
                <p>+60 123-456-789</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">📍</div>
              <div className="contact-info-content">
                <h4>Location</h4>
                <p>Kuala Lumpur, Malaysia</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">🕒</div>
              <div className="contact-info-content">
                <h4>Business Hours</h4>
                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h2 className="contact-form-title">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
              {success && <div className="success-message">{success}</div>}
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>


              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="form-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
