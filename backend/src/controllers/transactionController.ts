/**
 * Transaction Controller
 *
 * Handles transaction processing and retrieval
 */

import { Request, Response } from 'express';
import { query } from '../config/database';
import { FileProcessorService } from '../services/fileProcessorService';
import { AICategorizationService } from '../services/aiCategorizationService';
import { BudgetRecommendationService } from '../services/budgetRecommendationService';

export class TransactionController {
  /**
   * Process uploaded file and extract transactions
   * POST /api/transactions/process/:fileId
   */
  static async processFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { fileId } = req.params;

      // Get file info
      const fileResult = await query(
        'SELECT * FROM uploaded_files WHERE id = $1 AND user_id = $2',
        [fileId, req.user.userId]
      );

      if (fileResult.rows.length === 0) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      const file = fileResult.rows[0];

      // Update status to processing
      await query(
        'UPDATE uploaded_files SET status = $1 WHERE id = $2',
        ['processing', fileId]
      );

      try {
        // Extract transactions from file
        const extractedTransactions = await FileProcessorService.processFile(
          file.file_path,
          file.mime_type
        );

        if (extractedTransactions.length === 0) {
          await query(
            'UPDATE uploaded_files SET status = $1 WHERE id = $2',
            ['error', fileId]
          );
          res.status(400).json({ error: 'No transactions found in file' });
          return;
        }

        // Categorize transactions using AI
        const categorized = await AICategorizationService.categorizeTransactions(
          extractedTransactions.map(t => ({
            description: t.description,
            amount: t.amount,
            isIncome: t.isIncome,
          }))
        );

        // Save transactions to database
        for (let i = 0; i < extractedTransactions.length; i++) {
          const transaction = extractedTransactions[i];
          const category = categorized[i];

          await query(
            `INSERT INTO transactions
             (user_id, file_id, transaction_date, description, amount, category, subcategory, is_income)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              req.user.userId,
              fileId,
              transaction.date,
              transaction.description,
              transaction.amount,
              category.category,
              category.subcategory || null,
              transaction.isIncome,
            ]
          );
        }

        // Update file status to completed
        await query(
          'UPDATE uploaded_files SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['completed', fileId]
        );

        res.json({
          message: 'File processed successfully',
          transactionsCount: extractedTransactions.length,
        });
      } catch (error: any) {
        console.error('Processing error:', error);
        await query(
          'UPDATE uploaded_files SET status = $1 WHERE id = $2',
          ['error', fileId]
        );
        res.status(500).json({ error: 'Failed to process file: ' + error.message });
      }
    } catch (error) {
      console.error('Process file error:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  }

  /**
   * Get user's transactions
   * GET /api/transactions
   */
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { month, year, category } = req.query;

      let queryStr = 'SELECT * FROM transactions WHERE user_id = $1';
      const params: any[] = [req.user.userId];

      if (month && year) {
        queryStr += ' AND EXTRACT(MONTH FROM transaction_date) = $2 AND EXTRACT(YEAR FROM transaction_date) = $3';
        params.push(parseInt(month as string), parseInt(year as string));
      }

      if (category) {
        queryStr += ` AND category = $${params.length + 1}`;
        params.push(category);
      }

      queryStr += ' ORDER BY transaction_date DESC';

      const result = await query(queryStr, params);

      res.json({ transactions: result.rows });
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
  }

  /**
   * Get budget recommendations
   * GET /api/transactions/budget/:month/:year
   */
  static async getBudget(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { month, year } = req.params;

      const budget = await BudgetRecommendationService.generateBudget(
        req.user.userId,
        parseInt(month),
        parseInt(year)
      );

      res.json(budget);
    } catch (error: any) {
      console.error('Get budget error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate budget' });
    }
  }

  /**
   * Get spending analytics
   * GET /api/transactions/analytics/:month/:year
   */
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { month, year } = req.params;

      // Get category breakdown
      const categoryResult = await query(
        `SELECT category, SUM(amount) as total, COUNT(*) as count
         FROM transactions
         WHERE user_id = $1
         AND EXTRACT(MONTH FROM transaction_date) = $2
         AND EXTRACT(YEAR FROM transaction_date) = $3
         AND is_income = false
         GROUP BY category
         ORDER BY total DESC`,
        [req.user.userId, parseInt(month), parseInt(year)]
      );

      // Get daily spending trend
      const trendResult = await query(
        `SELECT
           DATE(transaction_date) as date,
           SUM(CASE WHEN is_income = false THEN amount ELSE 0 END) as expenses,
           SUM(CASE WHEN is_income = true THEN amount ELSE 0 END) as income
         FROM transactions
         WHERE user_id = $1
         AND EXTRACT(MONTH FROM transaction_date) = $2
         AND EXTRACT(YEAR FROM transaction_date) = $3
         GROUP BY DATE(transaction_date)
         ORDER BY date`,
        [req.user.userId, parseInt(month), parseInt(year)]
      );

      // Get top expenses
      const topExpenses = await query(
        `SELECT description, amount, category, transaction_date
         FROM transactions
         WHERE user_id = $1
         AND EXTRACT(MONTH FROM transaction_date) = $2
         AND EXTRACT(YEAR FROM transaction_date) = $3
         AND is_income = false
         ORDER BY amount DESC
         LIMIT 10`,
        [req.user.userId, parseInt(month), parseInt(year)]
      );

      res.json({
        categoryBreakdown: categoryResult.rows,
        dailyTrend: trendResult.rows,
        topExpenses: topExpenses.rows,
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  }
}
