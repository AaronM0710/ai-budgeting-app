/**
 * AI Categorization Service
 *
 * Uses OpenAI to automatically categorize transactions
 */

import OpenAI from 'openai';
import { query } from '../config/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CategorizedTransaction {
  description: string;
  category: string;
  subcategory?: string;
  confidence: number;
}

export class AICategorizationService {
  /**
   * Categorize a single transaction using AI
   */
  static async categorizeTransaction(description: string, amount: number, isIncome: boolean): Promise<CategorizedTransaction> {
    try {
      // Get available categories from database
      const categoriesResult = await query('SELECT name FROM categories WHERE is_default = true');
      const categories = categoriesResult.rows.map(r => r.name);

      const prompt = `Categorize this transaction into one of the following categories: ${categories.join(', ')}.

Transaction: ${description}
Amount: $${amount}
Type: ${isIncome ? 'Income' : 'Expense'}

Respond with ONLY a JSON object in this format:
{
  "category": "category name",
  "subcategory": "optional subcategory",
  "confidence": 0.95
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial categorization expert. Categorize transactions accurately based on their description and amount.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      if (!responseText) {
        throw new Error('No response from AI');
      }

      const result = JSON.parse(responseText);

      return {
        description,
        category: result.category || 'Other',
        subcategory: result.subcategory,
        confidence: result.confidence || 0.5,
      };
    } catch (error) {
      console.error('AI categorization error:', error);
      // Fallback to rule-based categorization
      return this.fallbackCategorization(description, isIncome);
    }
  }

  /**
   * Categorize multiple transactions in batch
   */
  static async categorizeTransactions(
    transactions: Array<{ description: string; amount: number; isIncome: boolean }>
  ): Promise<CategorizedTransaction[]> {
    const results: CategorizedTransaction[] = [];

    // Process in batches of 5 to avoid rate limits
    for (let i = 0; i < transactions.length; i += 5) {
      const batch = transactions.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(t => this.categorizeTransaction(t.description, t.amount, t.isIncome))
      );
      results.push(...batchResults);

      // Small delay between batches
      if (i + 5 < transactions.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Fallback rule-based categorization when AI fails
   */
  private static fallbackCategorization(description: string, isIncome: boolean): CategorizedTransaction {
    const lowerDesc = description.toLowerCase();

    if (isIncome) {
      return { description, category: 'Income', confidence: 0.8 };
    }

    // Housing
    if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage') || lowerDesc.includes('hoa')) {
      return { description, category: 'Housing', confidence: 0.9 };
    }

    // Transportation
    if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || lowerDesc.includes('gas') ||
        lowerDesc.includes('parking') || lowerDesc.includes('car')) {
      return { description, category: 'Transportation', confidence: 0.85 };
    }

    // Food & Dining
    if (lowerDesc.includes('restaurant') || lowerDesc.includes('cafe') || lowerDesc.includes('coffee') ||
        lowerDesc.includes('food') || lowerDesc.includes('doordash') || lowerDesc.includes('grubhub') ||
        lowerDesc.includes('grocery') || lowerDesc.includes('market')) {
      return { description, category: 'Food & Dining', confidence: 0.85 };
    }

    // Utilities
    if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('internet') ||
        lowerDesc.includes('phone') || lowerDesc.includes('utility')) {
      return { description, category: 'Utilities', confidence: 0.9 };
    }

    // Entertainment
    if (lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('movie') ||
        lowerDesc.includes('theater') || lowerDesc.includes('game') || lowerDesc.includes('music')) {
      return { description, category: 'Entertainment', confidence: 0.85 };
    }

    // Shopping
    if (lowerDesc.includes('amazon') || lowerDesc.includes('target') || lowerDesc.includes('walmart') ||
        lowerDesc.includes('store') || lowerDesc.includes('shop')) {
      return { description, category: 'Shopping', confidence: 0.75 };
    }

    // Healthcare
    if (lowerDesc.includes('pharmacy') || lowerDesc.includes('doctor') || lowerDesc.includes('medical') ||
        lowerDesc.includes('health') || lowerDesc.includes('hospital')) {
      return { description, category: 'Healthcare', confidence: 0.9 };
    }

    // Default to Other
    return { description, category: 'Other', confidence: 0.5 };
  }
}
