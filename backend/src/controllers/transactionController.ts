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

        // Save transactions to database (with duplicate detection)
        let savedCount = 0;
        let duplicateCount = 0;

        for (let i = 0; i < extractedTransactions.length; i++) {
          const transaction = extractedTransactions[i];
          const category = categorized[i];

          // Truncate description to fit database constraint (500 chars)
          const description = transaction.description.length > 500
            ? transaction.description.substring(0, 497) + '...'
            : transaction.description;

          // Check for duplicate: same user, date, description, and amount
          const duplicateCheck = await query(
            `SELECT id FROM transactions
             WHERE user_id = $1
             AND transaction_date = $2
             AND description = $3
             AND amount = $4`,
            [req.user.userId, transaction.date, description, transaction.amount]
          );

          if (duplicateCheck.rows.length > 0) {
            duplicateCount++;
            continue; // Skip duplicate
          }

          await query(
            `INSERT INTO transactions
             (user_id, file_id, transaction_date, description, amount, category, subcategory, is_income)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              req.user.userId,
              fileId,
              transaction.date,
              description,
              transaction.amount,
              category.category,
              category.subcategory || null,
              transaction.isIncome,
            ]
          );
          savedCount++;
        }

        // Update file status to completed
        await query(
          'UPDATE uploaded_files SET status = $1, processed_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['completed', fileId]
        );

        let message = `File processed successfully. Saved ${savedCount} transactions.`;
        if (duplicateCount > 0) {
          message += ` Skipped ${duplicateCount} duplicate(s).`;
        }

        res.json({
          message,
          transactionsCount: savedCount,
          duplicatesSkipped: duplicateCount,
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

  /**
   * Update a transaction (for manual category corrections)
   * PUT /api/transactions/:transactionId
   */
  static async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { transactionId } = req.params;
      const { category, subcategory, description } = req.body;

      // Verify transaction belongs to user
      const checkResult = await query(
        'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
        [transactionId, req.user.userId]
      );

      if (checkResult.rows.length === 0) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (category !== undefined) {
        updates.push(`category = $${paramCount}`);
        values.push(category);
        paramCount++;
      }

      if (subcategory !== undefined) {
        updates.push(`subcategory = $${paramCount}`);
        values.push(subcategory);
        paramCount++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(description.substring(0, 500)); // Enforce limit
        paramCount++;
      }

      if (updates.length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(transactionId);
      const updateQuery = `UPDATE transactions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

      const result = await query(updateQuery, values);

      res.json({
        message: 'Transaction updated',
        transaction: result.rows[0],
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }

  /**
   * Delete a transaction
   * DELETE /api/transactions/:transactionId
   */
  static async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { transactionId } = req.params;

      const result = await query(
        'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
        [transactionId, req.user.userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      console.error('Delete transaction error:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  }

  /**
   * Export transactions as CSV
   * GET /api/transactions/export
   */
  static async exportTransactions(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { month, year } = req.query;

      let queryStr = `
        SELECT
          transaction_date,
          description,
          amount,
          category,
          subcategory,
          CASE WHEN is_income THEN 'Income' ELSE 'Expense' END as type
        FROM transactions
        WHERE user_id = $1
      `;
      const params: any[] = [req.user.userId];

      if (month && year) {
        queryStr += ' AND EXTRACT(MONTH FROM transaction_date) = $2 AND EXTRACT(YEAR FROM transaction_date) = $3';
        params.push(parseInt(month as string), parseInt(year as string));
      }

      queryStr += ' ORDER BY transaction_date DESC';

      const result = await query(queryStr, params);

      // Build CSV
      const headers = ['Date', 'Description', 'Amount', 'Category', 'Subcategory', 'Type'];
      const csvRows = [headers.join(',')];

      for (const row of result.rows) {
        const values = [
          row.transaction_date.toISOString().split('T')[0],
          `"${(row.description || '').replace(/"/g, '""')}"`,
          row.amount,
          `"${row.category || ''}"`,
          `"${row.subcategory || ''}"`,
          row.type,
        ];
        csvRows.push(values.join(','));
      }

      const csv = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=transactions-${month || 'all'}-${year || 'all'}.csv`);
      res.send(csv);
    } catch (error) {
      console.error('Export transactions error:', error);
      res.status(500).json({ error: 'Failed to export transactions' });
    }
  }

  /**
   * Get available categories
   * GET /api/transactions/categories
   */
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const result = await query('SELECT name, icon, color FROM categories WHERE is_default = true ORDER BY name');
      res.json({ categories: result.rows });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to get categories' });
    }
  }
}
