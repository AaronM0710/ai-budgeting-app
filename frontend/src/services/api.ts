/**
 * API Service
 *
 * This handles all HTTP requests to the backend.
 * It uses axios to make HTTP calls.
 */

import axios from 'axios';
import { RegisterData, LoginData, AuthResponse, User, UploadedFile } from '../types';

// Base URL for API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== AUTHENTICATION =====

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  /**
   * Login a user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Save token to localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

// ===== FILE UPLOAD =====

export const uploadService = {
  /**
   * Upload a bank statement
   */
  uploadFile: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ message: string; file: UploadedFile }>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.file;
  },

  /**
   * Get user's uploaded files
   */
  getUserFiles: async (): Promise<UploadedFile[]> => {
    const response = await api.get<{ files: any[] }>('/upload/files');
    // Map backend response to frontend interface
    return response.data.files.map(file => ({
      id: file.id,
      filename: file.original_filename,
      size: file.file_size,
      status: file.status,
      uploaded_at: file.uploaded_at,
    }));
  },

  /**
   * Delete a file
   */
  deleteFile: async (fileId: string): Promise<void> => {
    await api.delete(`/upload/${fileId}`);
  },
};

export default api;
