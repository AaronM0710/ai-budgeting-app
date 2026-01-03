/**
 * Landing Page
 *
 * The first page users see at /home
 * Blends comic book energy with modern SaaS design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-text">Budget</span>
          <span className="logo-boom">BOOM!</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/waitlist" className="nav-cta">Join Waitlist</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Budgeting</div>
          <h1 className="hero-title">
            Take Control of Your
            <span className="hero-highlight"> Finances</span>
          </h1>
          <p className="hero-subtitle">
            Upload your bank statements and let us handle the rest.
            Smart categorization, actionable insights, and budget recommendations
            that actually make sense.
          </p>
          <div className="hero-cta">
            <Link to="/waitlist" className="btn-hero-primary">
              Join the Waitlist
              <span className="btn-explosion">BOOM!</span>
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Already have access? Login →
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <div className="card-icon">📊</div>
            <div className="card-label">Analytics</div>
          </div>
          <div className="hero-card hero-card-2">
            <div className="card-icon">🤖</div>
            <div className="card-label">AI Insights</div>
          </div>
          <div className="hero-card hero-card-3">
            <div className="card-icon">💰</div>
            <div className="card-label">Budget</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Why Budget Boom?</h2>
          <p className="features-subtitle">
            Budgeting apps shouldn't be boring. Or confusing. Or useless.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">⚡</span>
            </div>
            <h3 className="feature-title">Instant Analysis</h3>
            <p className="feature-description">
              Upload a PDF or CSV bank statement and get categorized transactions
              in seconds. No manual entry required.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🧠</span>
            </div>
            <h3 className="feature-title">AI-Powered Categories</h3>
            <p className="feature-description">
              Our AI understands context. "AMZN*2X4KF9" becomes "Amazon - Shopping"
              automatically.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📈</span>
            </div>
            <h3 className="feature-title">Smart Budgets</h3>
            <p className="feature-description">
              Get personalized budget recommendations based on your actual
              spending patterns, not generic advice.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🎯</span>
            </div>
            <h3 className="feature-title">Actionable Insights</h3>
            <p className="feature-description">
              See where your money goes with clear visualizations and
              specific recommendations to improve.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <h2 className="how-title">How It Works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Upload</h3>
            <p className="step-description">
              Drop your bank statement (PDF or CSV) into Budget Boom
            </p>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Analyze</h3>
            <p className="step-description">
              AI categorizes every transaction and spots patterns
            </p>
          </div>
          <div className="how-arrow">→</div>
          <div className="how-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Optimize</h3>
            <p className="step-description">
              Get personalized budget recommendations and insights
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-explosion">POW!</div>
          <h2 className="cta-title">Ready to Take Control?</h2>
          <p className="cta-subtitle">
            Join the waitlist and be the first to experience budgeting that doesn't suck.
          </p>
          <Link to="/waitlist" className="btn-cta">
            Join the Waitlist Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">Budget</span>
            <span className="logo-boom">BOOM!</span>
          </div>
          <p className="footer-tagline">AI-Powered Budgeting That Actually Works</p>
          <div className="footer-links">
            <Link to="/waitlist">Join Waitlist</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <p className="footer-copyright">© 2024 Budget Boom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
