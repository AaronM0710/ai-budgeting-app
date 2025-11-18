/**
 * Authentication Controller
 *
 * This handles the business logic for:
 * - User registration
 * - User login
 * - Getting current user info
 */

import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../middleware/auth';
import { RegisterUserDto, LoginUserDto } from '../types';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterUserDto = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      // Check if user agreed to terms
      if (!userData.agreed_to_terms) {
        res.status(400).json({
          error: 'You must agree to the Terms of Service to create an account',
        });
        return;
      }

      // Create the user
      const newUser = await UserModel.create(userData);

      // Generate JWT token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      // Return user data and token
      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  /**
   * Login a user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginUserDto = req.body;

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Verify password
      const isValidPassword = await UserModel.verifyPassword(
        password,
        user.password_hash
      );

      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Check if user agreed to terms
      if (!user.agreed_to_terms) {
        res.status(403).json({
          error: 'You must agree to the Terms of Service',
          requiresTermsAgreement: true,
        });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      // Return user data and token
      res.json({
        message: 'Login successful',
        user: UserModel.toResponse(user),
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   * (Protected route - requires authentication)
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Get fresh user data from database
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: UserModel.toResponse(user),
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user data' });
    }
  }
}
