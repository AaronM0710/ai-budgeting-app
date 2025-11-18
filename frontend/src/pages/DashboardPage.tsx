/**
 * Dashboard Page
 *
 * Main page after login. Users can:
 * - Upload bank statements
 * - View uploaded files
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadService } from '../services/api';
import { UploadedFile } from '../types';
import './Dashboard.css';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load user's files when component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const userFiles = await uploadService.getUserFiles();
      setFiles(userFiles);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await uploadService.uploadFile(selectedFile);
      setSuccess('File uploaded successfully!');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      // Reload files list
      await loadFiles();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (fileId: string, filename: string) => {
    if (!window.confirm(`Delete "${filename}"?`)) {
      return;
    }

    try {
      await uploadService.deleteFile(fileId);
      setSuccess('File deleted successfully!');
      await loadFiles();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete file');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>AI Budgeting App</h1>
        <div className="user-info">
          <span>Hello, {user?.first_name || user?.email}!</span>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Upload Section */}
        <section className="upload-section">
          <h2>Upload Bank Statement</h2>
          <p className="section-description">
            Upload your bank statement (PDF or CSV) to analyze your spending and generate a personalized budget.
          </p>

          <div className="upload-box">
            <input
              type="file"
              id="file-input"
              accept=".pdf,.csv"
              onChange={handleFileSelect}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose a file (PDF or CSV)'}
            </label>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="info-box">
            <strong>Note:</strong> We support bank statements in PDF or CSV format.
            Maximum file size: 10MB.
          </div>
        </section>

        {/* Files List Section */}
        <section className="files-section">
          <h2>Your Uploaded Files</h2>

          {files.length === 0 ? (
            <p className="empty-state">No files uploaded yet. Upload your first bank statement above!</p>
          ) : (
            <div className="files-list">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <h3>{file.filename}</h3>
                    <div className="file-meta">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploaded_at)}</span>
                    </div>
                  </div>
                  <div className="file-actions">
                    <span className={`status-badge status-${file.status}`}>
                      {file.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleDelete(file.id, file.filename)}
                      className="btn-delete"
                      title="Delete file"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Phase 2 Teaser */}
        <section className="coming-soon">
          <h3>Coming Soon</h3>
          <ul>
            <li>AI-powered transaction categorization</li>
            <li>Personalized budget recommendations</li>
            <li>Interactive spending charts</li>
            <li>Monthly financial insights</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
