/**
 * User Model
 *
 * This handles all database operations related to users.
 * Think of this as the "data layer" - it talks directly to the database.
 */

import { query } from '../config/database';
import bcrypt from 'bcrypt';
import { User, RegisterUserDto, UserResponse } from '../types';

export class UserModel {
  /**
   * Create a new user
   * - Hashes the password for security
   * - Stores user in database
   */
  static async create(userData: RegisterUserDto): Promise<UserResponse> {
    // Hash the password (bcrypt automatically adds salt)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Insert the user into the database
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, agreed_to_terms, terms_agreed_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, agreed_to_terms, created_at`,
      [
        userData.email.toLowerCase(),
        passwordHash,
        userData.first_name,
        userData.last_name,
        userData.agreed_to_terms,
        userData.agreed_to_terms ? new Date() : null,
      ]
    );

    return result.rows[0];
  }

  /**
   * Find a user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    return result.rows[0] || null;
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  /**
   * Verify a user's password
   * Used during login
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Convert User to UserResponse (remove sensitive data)
   */
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      agreed_to_terms: user.agreed_to_terms,
      created_at: user.created_at,
    };
  }

  /**
   * Update user's terms agreement
   */
  static async updateTermsAgreement(userId: string, agreed: boolean): Promise<void> {
    await query(
      `UPDATE users
       SET agreed_to_terms = $1, terms_agreed_at = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [agreed, agreed ? new Date() : null, userId]
    );
  }

  /**
   * Delete a user (for GDPR/CCPA compliance)
   */
  static async deleteUser(userId: string): Promise<void> {
    // This will cascade delete all related data
    await query('DELETE FROM users WHERE id = $1', [userId]);
  }
}
