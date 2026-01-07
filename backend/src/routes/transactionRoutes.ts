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

// Export transactions as CSV
router.get('/export', TransactionController.exportTransactions);

// Get available categories
router.get('/categories', TransactionController.getCategories);

// Update a transaction
router.put('/:transactionId', TransactionController.updateTransaction);

// Delete a transaction
router.delete('/:transactionId', TransactionController.deleteTransaction);

export default router;
