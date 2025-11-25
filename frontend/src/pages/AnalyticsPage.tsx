/**
 * Analytics Page
 *
 * Displays spending analytics, charts, and insights
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import './Analytics.css';

const AnalyticsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const COLORS = ['#ED1C24', '#0066CC', '#FFD100', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

  useEffect(() => {
    loadAnalytics();
  }, [selectedMonth, selectedYear]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, transactionsData] = await Promise.all([
        transactionService.getAnalytics(selectedMonth, selectedYear),
        transactionService.getTransactions(selectedMonth, selectedYear),
      ]);
      setAnalytics(analyticsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
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
      <div className="analytics-container">
        <div className="loading-state">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics || analytics.categoryBreakdown.length === 0) {
    return (
      <div className="analytics-container">
        <header className="analytics-header">
          <h1>Analytics</h1>
          <div className="header-actions">
            <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </header>
        <div className="empty-analytics">
          <h2>No Transactions Yet</h2>
          <p>Upload and process a bank statement to see your analytics!</p>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const pieData = analytics.categoryBreakdown.map((cat: any) => ({
    name: cat.category,
    value: parseFloat(cat.total),
  }));

  const totalSpent = pieData.reduce((sum: number, cat: any) => sum + cat.value, 0);

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="header-actions">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="month-selector"
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
            className="year-selector"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Link to="/dashboard" className="btn-secondary">← Dashboard</Link>
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <main className="analytics-main">
        {/* Summary Cards */}
        <section className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">💸</div>
            <div className="summary-value">{formatCurrency(totalSpent)}</div>
            <div className="summary-label">Total Spent</div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-value">{analytics.categoryBreakdown.length}</div>
            <div className="summary-label">Categories</div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🧾</div>
            <div className="summary-value">{transactions.length}</div>
            <div className="summary-label">Transactions</div>
          </div>
        </section>

        {/* Category Breakdown Pie Chart */}
        <section className="chart-section">
          <h2>Spending by Category</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Daily Trend */}
        {analytics.dailyTrend && analytics.dailyTrend.length > 0 && (
          <section className="chart-section">
            <h2>Daily Spending Trend</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="expenses" stroke="#ED1C24" name="Expenses" />
                  <Line type="monotone" dataKey="income" stroke="#2ECC71" name="Income" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Category Breakdown Bar Chart */}
        <section className="chart-section">
          <h2>Category Breakdown</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="total" fill="#0066CC" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top Expenses */}
        <section className="top-expenses-section">
          <h2>Top 10 Expenses</h2>
          <div className="expenses-list">
            {analytics.topExpenses.map((expense: any, index: number) => (
              <div key={index} className="expense-item">
                <div className="expense-rank">#{index + 1}</div>
                <div className="expense-details">
                  <div className="expense-description">{expense.description}</div>
                  <div className="expense-meta">
                    <span className="expense-category">{expense.category}</span>
                    <span>•</span>
                    <span>{new Date(expense.transaction_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="analytics-actions">
          <Link to="/budget" className="action-btn">
            💰 View Budget Recommendations
          </Link>
          <Link to="/dashboard" className="action-btn">
            📁 Upload More Statements
          </Link>
        </section>
      </main>
    </div>
  );
};

export default AnalyticsPage;
