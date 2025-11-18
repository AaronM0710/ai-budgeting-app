/**
 * Waitlist Routes
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { WaitlistController } from '../controllers/waitlistController';
import { checkValidation } from '../middleware/validation';

const router = Router();

/**
 * POST /api/waitlist
 * Join the waitlist
 */
router.post(
  '/',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Name is too long'),
    body('referral_source')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Referral source is too long'),
    checkValidation,
  ],
  WaitlistController.joinWaitlist
);

/**
 * GET /api/waitlist/stats
 * Get waitlist statistics
 */
router.get('/stats', WaitlistController.getStats);

export default router;
