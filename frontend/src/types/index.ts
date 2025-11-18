/**
 * TypeScript Types for Frontend
 *
 * These match the backend types
 */

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  agreed_to_terms: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  agreed_to_terms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploaded_at: string;
}
