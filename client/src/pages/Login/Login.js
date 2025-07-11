import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (form.email === 'user@example.com' && form.password === 'password') {
        alert('Login successful!');
      } else {
        setError('Invalid email or password');
      }
    }, 1200);
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-illustration">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f512.png" alt="Login" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <p className="login-subtitle">Welcome back! Please login to your account.</p>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <div className="login-links">
            <a href="/forgot-password">Forgot password?</a>
            <span> | </span>
            <a href="/register">Create account</a>
          </div>
        </form>
      </div>
    </div>
  );
}