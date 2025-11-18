/**
 * Authentication Routes
 *
 * These define the API endpoints for user authentication:
 * - POST /api/auth/register - Create new account
 * - POST /api/auth/login - Login
 * - GET /api/auth/me - Get current user (protected)
 */

import express from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegistration, validateLogin, checkValidation } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post(
  '/register',
  validateRegistration,
  checkValidation,
  AuthController.register
);

router.post(
  '/login',
  validateLogin,
  checkValidation,
  AuthController.login
);

// Protected routes (require authentication)
router.get(
  '/me',
  authenticateToken,
  AuthController.getCurrentUser
);

export default router;
