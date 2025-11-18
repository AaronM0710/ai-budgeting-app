/**
 * TypeScript Type Definitions
 *
 * These define the shape of our data objects.
 * TypeScript will help us catch errors before they happen!
 */

// User object (from database)
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  agreed_to_terms: boolean;
  terms_agreed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// User data for registration (what the client sends)
export interface RegisterUserDto {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  agreed_to_terms: boolean;
}

// User data for login
export interface LoginUserDto {
  email: string;
  password: string;
}

// The user object we send back to the client (no password!)
export interface UserResponse {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  agreed_to_terms: boolean;
  created_at: Date;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
}

// Uploaded File
export interface UploadedFile {
  id: string;
  user_id: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploaded_at: Date;
  processed_at?: Date;
}

// Express Request with authenticated user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}
