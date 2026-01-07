/**
 * AI Categorization Service
 *
 * Uses OpenAI to automatically categorize transactions
 * With retry logic and robust error handling for production
 */

import OpenAI from 'openai';
import { query } from '../config/database';

// Only initialize OpenAI if API key is configured
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key'
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_DELAY_MS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error?.status === 401 || error?.status === 403) {
        throw error; // Auth errors - don't retry
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export interface CategorizedTransaction {
  description: string;
  category: string;
  subcategory?: string;
  confidence: number;
}

export class AICategorizationService {
  // Cache for categories to avoid repeated DB queries
  private static categoriesCache: string[] | null = null;
  private static categoriesCacheTime: number = 0;
  private static CACHE_TTL_MS = 60000; // 1 minute cache

  /**
   * Get categories with caching
   */
  private static async getCategories(): Promise<string[]> {
    const now = Date.now();
    if (this.categoriesCache && now - this.categoriesCacheTime < this.CACHE_TTL_MS) {
      return this.categoriesCache;
    }

    try {
      const categoriesResult = await query('SELECT name FROM categories WHERE is_default = true');
      this.categoriesCache = categoriesResult.rows.map(r => r.name);
      this.categoriesCacheTime = now;
      return this.categoriesCache;
    } catch {
      // Return default categories if DB fails
      return ['Housing', 'Transportation', 'Food & Dining', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Income', 'Other'];
    }
  }

  /**
   * Check if AI is available
   */
  static isAIAvailable(): boolean {
    return openai !== null;
  }

  /**
   * Categorize a single transaction using AI
   */
  static async categorizeTransaction(description: string, amount: number, isIncome: boolean): Promise<CategorizedTransaction> {
    // If AI not configured, use rule-based immediately
    if (!openai) {
      console.log('OpenAI not configured, using rule-based categorization');
      return this.fallbackCategorization(description, isIncome);
    }

    try {
      const categories = await this.getCategories();

      const prompt = `Categorize this transaction into one of the following categories: ${categories.join(', ')}.

Transaction: ${description}
Amount: $${Math.abs(amount)}
Type: ${isIncome ? 'Income' : 'Expense'}

Respond with ONLY a JSON object in this format:
{
  "category": "category name",
  "subcategory": "optional subcategory",
  "confidence": 0.95
}`;

      const result = await withRetry(async () => {
        const completion = await openai!.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a financial categorization expert. Categorize transactions accurately based on their description and amount. Always respond with valid JSON only.',
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

        // Parse JSON, handling potential markdown code blocks
        let jsonStr = responseText;
        if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        }

        return JSON.parse(jsonStr);
      });

      return {
        description,
        category: result.category || 'Other',
        subcategory: result.subcategory,
        confidence: result.confidence || 0.5,
      };
    } catch (error) {
      console.error('AI categorization error after retries:', error);
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
   * Comprehensive keyword matching for common merchants and transaction types
   */
  private static fallbackCategorization(description: string, isIncome: boolean): CategorizedTransaction {
    const lowerDesc = description.toLowerCase();

    if (isIncome) {
      return { description, category: 'Income', confidence: 0.8 };
    }

    // Housing - rent, mortgage, property
    if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage') || lowerDesc.includes('hoa') ||
        lowerDesc.includes('property') || lowerDesc.includes('landlord') || lowerDesc.includes('lease') ||
        lowerDesc.includes('apartment') || lowerDesc.includes('housing')) {
      return { description, category: 'Housing', confidence: 0.9 };
    }

    // Transportation - rideshare, gas, auto
    if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || lowerDesc.includes('gas') ||
        lowerDesc.includes('parking') || lowerDesc.includes('car') || lowerDesc.includes('auto') ||
        lowerDesc.includes('fuel') || lowerDesc.includes('shell') || lowerDesc.includes('chevron') ||
        lowerDesc.includes('exxon') || lowerDesc.includes('bp ') || lowerDesc.includes('transit') ||
        lowerDesc.includes('metro') || lowerDesc.includes('subway') || lowerDesc.includes('bus')) {
      return { description, category: 'Transportation', confidence: 0.85 };
    }

    // Food & Dining - restaurants, delivery, groceries
    if (lowerDesc.includes('restaurant') || lowerDesc.includes('cafe') || lowerDesc.includes('coffee') ||
        lowerDesc.includes('food') || lowerDesc.includes('doordash') || lowerDesc.includes('grubhub') ||
        lowerDesc.includes('ubereats') || lowerDesc.includes('postmates') || lowerDesc.includes('instacart') ||
        lowerDesc.includes('grocery') || lowerDesc.includes('market') || lowerDesc.includes('starbucks') ||
        lowerDesc.includes('mcdonald') || lowerDesc.includes('burger') || lowerDesc.includes('pizza') ||
        lowerDesc.includes('chipotle') || lowerDesc.includes('subway') || lowerDesc.includes('wendy') ||
        lowerDesc.includes('taco') || lowerDesc.includes('dunkin') || lowerDesc.includes('kroger') ||
        lowerDesc.includes('safeway') || lowerDesc.includes('whole foods') || lowerDesc.includes('trader joe') ||
        lowerDesc.includes('aldi') || lowerDesc.includes('costco') || lowerDesc.includes('publix')) {
      return { description, category: 'Food & Dining', confidence: 0.85 };
    }

    // Utilities - bills, services
    if (lowerDesc.includes('electric') || lowerDesc.includes('water') || lowerDesc.includes('internet') ||
        lowerDesc.includes('phone') || lowerDesc.includes('utility') || lowerDesc.includes('cable') ||
        lowerDesc.includes('comcast') || lowerDesc.includes('xfinity') || lowerDesc.includes('verizon') ||
        lowerDesc.includes('at&t') || lowerDesc.includes('att') || lowerDesc.includes('t-mobile') ||
        lowerDesc.includes('sprint') || lowerDesc.includes('pge') || lowerDesc.includes('edison') ||
        lowerDesc.includes('gas bill') || lowerDesc.includes('sewage') || lowerDesc.includes('trash')) {
      return { description, category: 'Utilities', confidence: 0.9 };
    }

    // Entertainment - streaming, gaming, leisure
    if (lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('movie') ||
        lowerDesc.includes('theater') || lowerDesc.includes('game') || lowerDesc.includes('music') ||
        lowerDesc.includes('hulu') || lowerDesc.includes('disney') || lowerDesc.includes('hbo') ||
        lowerDesc.includes('amazon prime') || lowerDesc.includes('apple tv') || lowerDesc.includes('youtube') ||
        lowerDesc.includes('twitch') || lowerDesc.includes('steam') || lowerDesc.includes('playstation') ||
        lowerDesc.includes('xbox') || lowerDesc.includes('nintendo') || lowerDesc.includes('concert') ||
        lowerDesc.includes('ticket') || lowerDesc.includes('cinema') || lowerDesc.includes('amc')) {
      return { description, category: 'Entertainment', confidence: 0.85 };
    }

    // Shopping - retail, online
    if (lowerDesc.includes('amazon') || lowerDesc.includes('target') || lowerDesc.includes('walmart') ||
        lowerDesc.includes('store') || lowerDesc.includes('shop') || lowerDesc.includes('best buy') ||
        lowerDesc.includes('home depot') || lowerDesc.includes('lowes') || lowerDesc.includes('ikea') ||
        lowerDesc.includes('ebay') || lowerDesc.includes('etsy') || lowerDesc.includes('nordstrom') ||
        lowerDesc.includes('macy') || lowerDesc.includes('kohls') || lowerDesc.includes('jcpenney') ||
        lowerDesc.includes('old navy') || lowerDesc.includes('gap') || lowerDesc.includes('nike') ||
        lowerDesc.includes('adidas') || lowerDesc.includes('amzn') || lowerDesc.includes('purchase')) {
      return { description, category: 'Shopping', confidence: 0.75 };
    }

    // Healthcare - medical, pharmacy, fitness
    if (lowerDesc.includes('pharmacy') || lowerDesc.includes('doctor') || lowerDesc.includes('medical') ||
        lowerDesc.includes('health') || lowerDesc.includes('hospital') || lowerDesc.includes('cvs') ||
        lowerDesc.includes('walgreens') || lowerDesc.includes('rite aid') || lowerDesc.includes('dental') ||
        lowerDesc.includes('vision') || lowerDesc.includes('optical') || lowerDesc.includes('clinic') ||
        lowerDesc.includes('urgent care') || lowerDesc.includes('insurance') || lowerDesc.includes('gym') ||
        lowerDesc.includes('fitness') || lowerDesc.includes('planet fitness') || lowerDesc.includes('equinox')) {
      return { description, category: 'Healthcare', confidence: 0.9 };
    }

    // Personal Care
    if (lowerDesc.includes('salon') || lowerDesc.includes('barber') || lowerDesc.includes('spa') ||
        lowerDesc.includes('nail') || lowerDesc.includes('beauty') || lowerDesc.includes('haircut')) {
      return { description, category: 'Personal Care', confidence: 0.85 };
    }

    // Education
    if (lowerDesc.includes('tuition') || lowerDesc.includes('school') || lowerDesc.includes('university') ||
        lowerDesc.includes('college') || lowerDesc.includes('course') || lowerDesc.includes('udemy') ||
        lowerDesc.includes('coursera') || lowerDesc.includes('book')) {
      return { description, category: 'Education', confidence: 0.85 };
    }

    // Travel
    if (lowerDesc.includes('airline') || lowerDesc.includes('hotel') || lowerDesc.includes('airbnb') ||
        lowerDesc.includes('flight') || lowerDesc.includes('travel') || lowerDesc.includes('expedia') ||
        lowerDesc.includes('booking') || lowerDesc.includes('delta') || lowerDesc.includes('united') ||
        lowerDesc.includes('american air') || lowerDesc.includes('southwest') || lowerDesc.includes('marriott') ||
        lowerDesc.includes('hilton') || lowerDesc.includes('hyatt')) {
      return { description, category: 'Travel', confidence: 0.9 };
    }

    // Subscriptions
    if (lowerDesc.includes('subscription') || lowerDesc.includes('membership') || lowerDesc.includes('monthly') ||
        lowerDesc.includes('annual') || lowerDesc.includes('recurring')) {
      return { description, category: 'Subscriptions', confidence: 0.7 };
    }

    // Default to Other
    return { description, category: 'Other', confidence: 0.5 };
  }
}
