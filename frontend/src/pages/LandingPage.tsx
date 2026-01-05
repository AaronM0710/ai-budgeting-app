/**
 * Landing Page
 *
 * The first page users see at /home
 * Blends comic book energy with modern SaaS design
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/home" className="nav-logo">
          <span className="logo-text">Budget</span>
          <span className="logo-boom">BOOM!</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links nav-desktop">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/waitlist" className="nav-cta">Join Waitlist</Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#features" className="nav-mobile-link" onClick={closeMobileMenu}>Features</a>
          <a href="#how-it-works" className="nav-mobile-link" onClick={closeMobileMenu}>How It Works</a>
          <a href="#faq" className="nav-mobile-link" onClick={closeMobileMenu}>FAQ</a>
          <Link to="/login" className="nav-mobile-link" onClick={closeMobileMenu}>Login</Link>
          <Link to="/waitlist" className="nav-mobile-cta" onClick={closeMobileMenu}>Join Waitlist</Link>
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
      <section id="features" className="features-section">
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
      <section id="how-it-works" className="how-section">
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
              Smart categorization identifies every transaction automatically
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="testimonials-title">What People Are Saying</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              Finally, a budgeting app that doesn't make me want to pull my hair out.
              The automatic categorization is a game changer.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <span className="author-name">Sarah M.</span>
                <span className="author-title">Marketing Manager</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              I used to spend hours categorizing transactions in spreadsheets.
              Now it takes seconds. Absolute time saver.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JR</div>
              <div className="author-info">
                <span className="author-name">James R.</span>
                <span className="author-title">Software Engineer</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-quote">"</div>
            <p className="testimonial-text">
              The insights actually helped me find subscriptions I forgot about.
              Already saved $50/month!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EK</div>
              <div className="author-info">
                <span className="author-name">Emily K.</span>
                <span className="author-title">Freelance Designer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3 className="faq-question">Is my financial data secure?</h3>
            <p className="faq-answer">
              Absolutely. We use bank-level encryption and never store your actual bank credentials.
              Your statement data is processed securely and you can delete it anytime.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What file formats do you support?</h3>
            <p className="faq-answer">
              We support PDF and CSV bank statements from most major banks.
              If your format isn't supported, let us know and we'll add it.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">How accurate is the categorization?</h3>
            <p className="faq-answer">
              Our smart categorization correctly identifies 95%+ of transactions.
              You can always manually adjust categories if needed.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Is Budget Boom free?</h3>
            <p className="faq-answer">
              We're currently in early access. Join the waitlist to be notified
              when we launch with our pricing plans.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Can I export my data?</h3>
            <p className="faq-answer">
              Yes! You can export your categorized transactions and budget reports
              in CSV format at any time. Your data belongs to you.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Do you connect directly to my bank?</h3>
            <p className="faq-answer">
              No. Budget Boom works by analyzing statement files you upload.
              We never ask for or store your bank login credentials.
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
          <p className="footer-tagline">Smart Budgeting That Actually Works</p>
          <div className="footer-links">
            <Link to="/waitlist">Join Waitlist</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-legal">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <p className="footer-copyright">© 2025 Budget Boom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
