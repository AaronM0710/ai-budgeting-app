/**
 * Transaction Routes
 */

import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

// Process uploaded file to extract transactions
router.post('/process/:fileId', TransactionController.processFile);

// Get user's transactions
router.get('/', TransactionController.getTransactions);

// Get budget recommendations
router.get('/budget/:month/:year', TransactionController.getBudget);

// Get analytics
router.get('/analytics/:month/:year', TransactionController.getAnalytics);

export default router;
