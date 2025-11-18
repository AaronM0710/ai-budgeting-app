/**
 * Input Validation Middleware
 *
 * This validates all data coming from clients to prevent:
 * - SQL injection
 * - XSS attacks
 * - Invalid data
 */

import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation Rules for User Registration
 */
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),

  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name is too long'),

  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name is too long'),

  body('agreed_to_terms')
    .isBoolean()
    .custom((value) => value === true)
    .withMessage('You must agree to the Terms of Service'),
];

/**
 * Validation Rules for Login
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Middleware to check validation results
 * Use this after your validation rules
 */
export const checkValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }

  next();
};
