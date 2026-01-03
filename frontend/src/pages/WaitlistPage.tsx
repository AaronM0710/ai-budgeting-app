/**
 * Waitlist Page
 *
 * Early users can sign up for access
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Waitlist.css';

const WaitlistPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    referral_source: '',
  });

  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setSuccess(true);
      setPosition(data.waitlist_position);
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="waitlist-container">
        <div className="waitlist-success-card">
          <div className="success-explosion">BOOM!</div>
          <h1>You're On The List!</h1>
          <p className="success-subtitle">Welcome to the future of budgeting!</p>

          <div className="position-badge">
            <div className="position-label">Your Position</div>
            <div className="position-number">#{position}</div>
          </div>

          <div className="success-message">
            <p>🎉 We'll email you at <strong>{formData.email}</strong> when we're ready!</p>
            <p>In the meantime, check out what we're building...</p>
          </div>

          <div className="action-buttons">
            <Link to="/login" className="btn-primary">
              Already Have Access? Login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="waitlist-container">
      <div className="waitlist-card">
        <div className="waitlist-header">
          <h1>Budget BOOM!</h1>
          <div className="tagline">AI-Powered Budgeting That Actually Works</div>
        </div>

        <div className="features-preview">
          <div className="feature-badge">📊 Smart AI Analysis</div>
          <div className="feature-badge">💰 Auto-Categorization</div>
          <div className="feature-badge">⚡ Instant Insights</div>
        </div>

        <div className="waitlist-pitch">
          <h2>Join The Early Access List</h2>
          <p>Be one of the first to experience budgeting that doesn't suck. Limited spots available!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your awesome name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="referral_source">How'd You Find Us?</label>
            <select
              id="referral_source"
              name="referral_source"
              value={formData.referral_source}
              onChange={handleChange}
            >
              <option value="">Select one...</option>
              <option value="friend">Friend Referral</option>
              <option value="social">Social Media</option>
              <option value="search">Search Engine</option>
              <option value="reddit">Reddit</option>
              <option value="twitter">Twitter/X</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn-primary btn-waitlist" disabled={loading}>
            {loading ? 'Joining...' : 'Join The Waitlist!'}
          </button>
        </form>

        <div className="waitlist-footer">
          <p>Already have access? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
