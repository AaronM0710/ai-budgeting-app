/**
 * Budget Page
 *
 * Displays AI-generated budget recommendations
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { Link } from 'react-router-dom';
import './Budget.css';

const BudgetPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadBudget();
  }, [selectedMonth, selectedYear]);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const budgetData = await transactionService.getBudget(selectedMonth, selectedYear);
      setBudget(budgetData);
    } catch (error: any) {
      console.error('Failed to load budget:', error);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="budget-container">
        <div className="loading-state">Generating budget...</div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="budget-container">
        <header className="budget-header">
          <h1>Budget Planner</h1>
          <div className="header-actions">
            <Link to="/dashboard" className="btn-secondary">← Back</Link>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </header>
        <div className="empty-budget">
          <h2>No Data Available</h2>
          <p>Upload and process transactions for this month to generate a budget!</p>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-container">
      <header className="budget-header">
        <h1>AI Budget Planner</h1>
        <div className="header-actions">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Link to="/dashboard" className="btn-secondary">← Dashboard</Link>
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <main className="budget-main">
        {/* Summary */}
        <section className="budget-summary">
          <div className="summary-item">
            <div className="summary-label">Total Income</div>
            <div className="summary-value income">{formatCurrency(budget.totalIncome)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value expense">{formatCurrency(budget.totalExpenses)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Savings Rate</div>
            <div className="summary-value savings">{budget.savingsRate.toFixed(1)}%</div>
          </div>
        </section>

        {/* AI Insights */}
        {budget.aiInsights && (
          <section className="ai-insights">
            <h2>AI Financial Insights</h2>
            <div className="insights-box">
              {budget.aiInsights.split('\n').map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        )}

        {/* Budget Recommendations */}
        <section className="budget-recommendations">
          <h2>Budget Recommendations</h2>
          <div className="recommendations-grid">
            {budget.recommendations.map((rec: any, index: number) => (
              <div key={index} className="recommendation-card">
                <h3>{rec.category}</h3>
                <div className="rec-amounts">
                  <div className="amount-row">
                    <span className="amount-label">Current:</span>
                    <span className="amount-value">{formatCurrency(rec.currentSpending)}</span>
                  </div>
                  <div className="amount-row">
                    <span className="amount-label">Recommended:</span>
                    <span className="amount-value recommended">{formatCurrency(rec.recommendedAmount)}</span>
                  </div>
                  <div className="amount-row">
                    <span className="amount-label">% of Income:</span>
                    <span className="amount-value">{rec.percentageOfIncome.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="rec-reasoning">{rec.reasoning}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((rec.currentSpending / rec.recommendedAmount) * 100, 100)}%`,
                      backgroundColor: rec.currentSpending > rec.recommendedAmount ? '#ED1C24' : '#2ECC71',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="budget-actions">
          <Link to="/analytics" className="action-btn">📊 View Analytics</Link>
          <Link to="/dashboard" className="action-btn">📁 Upload More Data</Link>
        </section>
      </main>
    </div>
  );
};

export default BudgetPage;
