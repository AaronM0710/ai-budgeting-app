/**
 * Transactions Page
 *
 * View, edit, and manage transactions
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/api';
import { Link } from 'react-router-dom';
import './Transactions.css';

interface Transaction {
  id: string;
  transaction_date: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  is_income: boolean;
}

interface Category {
  name: string;
  icon?: string;
  color?: string;
}

const TransactionsPage: React.FC = () => {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, [selectedMonth, selectedYear, selectedCategory]);

  const loadCategories = async () => {
    try {
      const cats = await transactionService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Fallback categories
      setCategories([
        { name: 'Housing' },
        { name: 'Transportation' },
        { name: 'Food & Dining' },
        { name: 'Utilities' },
        { name: 'Entertainment' },
        { name: 'Shopping' },
        { name: 'Healthcare' },
        { name: 'Personal Care' },
        { name: 'Education' },
        { name: 'Travel' },
        { name: 'Subscriptions' },
        { name: 'Income' },
        { name: 'Other' },
      ]);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(
        selectedMonth,
        selectedYear,
        selectedCategory || undefined
      );
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditCategory(transaction.category);
    setEditDescription(transaction.description);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await transactionService.updateTransaction(editingId, {
        category: editCategory,
        description: editDescription,
      });
      setSuccess('Transaction updated!');
      setEditingId(null);
      await loadTransactions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update transaction');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditCategory('');
    setEditDescription('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;

    try {
      await transactionService.deleteTransaction(id);
      setSuccess('Transaction deleted!');
      await loadTransactions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const handleExport = async () => {
    try {
      await transactionService.exportTransactions(selectedMonth, selectedYear);
      setSuccess('Export downloaded!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to export transactions');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number, isIncome: boolean): string => {
    const prefix = isIncome ? '+' : '-';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const totalIncome = transactions.filter(t => t.is_income).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = transactions.filter(t => !t.is_income).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="transactions-container">
      {/* Header */}
      <header className="transactions-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-link">← Dashboard</Link>
          <h1>Transactions</h1>
        </div>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </header>

      {/* Filters & Actions */}
      <div className="transactions-controls">
        <div className="filters">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="filter-select"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="filter-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button onClick={handleExport} className="btn-export">
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="transactions-summary">
        <div className="summary-card income">
          <span className="summary-label">Income</span>
          <span className="summary-value">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="summary-card expenses">
          <span className="summary-label">Expenses</span>
          <span className="summary-value">-${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="summary-card net">
          <span className="summary-label">Net</span>
          <span className={`summary-value ${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
            ${(totalIncome - totalExpenses).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Transactions List */}
      <div className="transactions-list">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found for this period.</p>
            <Link to="/dashboard" className="btn-primary">Upload a statement</Link>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className={transaction.is_income ? 'income-row' : 'expense-row'}>
                  <td className="date-cell">{formatDate(transaction.transaction_date)}</td>
                  <td className="description-cell">
                    {editingId === transaction.id ? (
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      transaction.description
                    )}
                  </td>
                  <td className="category-cell">
                    {editingId === transaction.id ? (
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="edit-select"
                      >
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="category-badge">{transaction.category}</span>
                    )}
                  </td>
                  <td className={`amount-cell ${transaction.is_income ? 'income' : 'expense'}`}>
                    {formatAmount(transaction.amount, transaction.is_income)}
                  </td>
                  <td className="actions-cell">
                    {editingId === transaction.id ? (
                      <>
                        <button onClick={handleSave} className="btn-save" title="Save">✓</button>
                        <button onClick={handleCancel} className="btn-cancel" title="Cancel">✕</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(transaction)} className="btn-edit" title="Edit">✎</button>
                        <button onClick={() => handleDelete(transaction.id)} className="btn-delete" title="Delete">🗑</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Navigation */}
      <div className="quick-nav">
        <Link to="/analytics" className="nav-link">View Analytics →</Link>
        <Link to="/budget" className="nav-link">Budget Planner →</Link>
      </div>
    </div>
  );
};

export default TransactionsPage;
