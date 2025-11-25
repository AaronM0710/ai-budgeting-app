/**
 * Budget Recommendation Service
 *
 * Generates personalized budget recommendations based on transaction history
 */

import { query } from '../config/database';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BudgetRecommendation {
  category: string;
  recommendedAmount: number;
  currentSpending: number;
  percentageOfIncome: number;
  reasoning: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  recommendations: BudgetRecommendation[];
  aiInsights: string;
}

export class BudgetRecommendationService {
  /**
   * Generate budget recommendations for a user
   */
  static async generateBudget(userId: string, month: number, year: number): Promise<BudgetSummary> {
    // Get user's transaction history
    const transactions = await this.getTransactionHistory(userId, month, year);

    if (transactions.length === 0) {
      throw new Error('No transaction history found for this period');
    }

    // Calculate spending by category
    const categorySpending = this.aggregateByCategory(transactions);

    // Calculate total income and expenses
    const totalIncome = transactions
      .filter(t => t.is_income)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => !t.is_income)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Generate AI-powered recommendations
    const recommendations = await this.generateAIRecommendations(
      categorySpending,
      totalIncome,
      totalExpenses
    );

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Generate AI insights
    const aiInsights = await this.generateInsights(
      categorySpending,
      totalIncome,
      totalExpenses,
      savingsRate
    );

    return {
      totalIncome,
      totalExpenses,
      savingsRate,
      recommendations,
      aiInsights,
    };
  }

  /**
   * Get transaction history for a user
   */
  private static async getTransactionHistory(userId: string, month: number, year: number) {
    const result = await query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       AND EXTRACT(MONTH FROM transaction_date) = $2
       AND EXTRACT(YEAR FROM transaction_date) = $3
       ORDER BY transaction_date DESC`,
      [userId, month, year]
    );

    return result.rows;
  }

  /**
   * Aggregate transactions by category
   */
  private static aggregateByCategory(transactions: any[]): Map<string, number> {
    const categoryMap = new Map<string, number>();

    transactions
      .filter(t => !t.is_income)
      .forEach(t => {
        const category = t.category || 'Other';
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + parseFloat(t.amount));
      });

    return categoryMap;
  }

  /**
   * Generate AI-powered budget recommendations
   */
  private static async generateAIRecommendations(
    categorySpending: Map<string, number>,
    totalIncome: number,
    totalExpenses: number
  ): Promise<BudgetRecommendation[]> {
    try {
      const spendingData = Array.from(categorySpending.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          percentageOfIncome: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
        }));

      const prompt = `As a financial advisor, analyze this monthly spending and provide budget recommendations.

Total Monthly Income: $${totalIncome.toFixed(2)}
Total Monthly Expenses: $${totalExpenses.toFixed(2)}

Current Spending by Category:
${spendingData.map(s => `${s.category}: $${s.amount.toFixed(2)} (${s.percentageOfIncome.toFixed(1)}% of income)`).join('\n')}

Provide budget recommendations for each category. Use the 50/30/20 rule as a guideline:
- 50% Needs (Housing, Utilities, Food, Transportation, Healthcare)
- 30% Wants (Entertainment, Shopping, Dining Out)
- 20% Savings & Debt Repayment

Respond with a JSON array of recommendations in this exact format:
[
  {
    "category": "category name",
    "recommendedAmount": 500,
    "reasoning": "brief explanation"
  }
]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial advisor specializing in personal budgeting. Provide practical, actionable budget recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      if (!responseText) {
        return this.fallbackRecommendations(categorySpending, totalIncome);
      }

      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return this.fallbackRecommendations(categorySpending, totalIncome);
      }

      const aiRecommendations = JSON.parse(jsonMatch[0]);

      return aiRecommendations.map((rec: any) => ({
        category: rec.category,
        recommendedAmount: rec.recommendedAmount || 0,
        currentSpending: categorySpending.get(rec.category) || 0,
        percentageOfIncome: totalIncome > 0 ? (rec.recommendedAmount / totalIncome) * 100 : 0,
        reasoning: rec.reasoning || '',
      }));
    } catch (error) {
      console.error('AI recommendation error:', error);
      return this.fallbackRecommendations(categorySpending, totalIncome);
    }
  }

  /**
   * Fallback recommendations using 50/30/20 rule
   */
  private static fallbackRecommendations(
    categorySpending: Map<string, number>,
    totalIncome: number
  ): BudgetRecommendation[] {
    const needs = ['Housing', 'Utilities', 'Food & Dining', 'Transportation', 'Healthcare'];
    const wants = ['Entertainment', 'Shopping', 'Personal Care'];

    const recommendations: BudgetRecommendation[] = [];

    // 50% for needs
    const needsBudget = totalIncome * 0.5;
    const needsCount = needs.length;
    needs.forEach(category => {
      recommendations.push({
        category,
        recommendedAmount: needsBudget / needsCount,
        currentSpending: categorySpending.get(category) || 0,
        percentageOfIncome: 50 / needsCount,
        reasoning: 'Based on the 50/30/20 rule - essential needs should be 50% of income',
      });
    });

    // 30% for wants
    const wantsBudget = totalIncome * 0.3;
    const wantsCount = wants.length;
    wants.forEach(category => {
      recommendations.push({
        category,
        recommendedAmount: wantsBudget / wantsCount,
        currentSpending: categorySpending.get(category) || 0,
        percentageOfIncome: 30 / wantsCount,
        reasoning: 'Based on the 50/30/20 rule - discretionary spending should be 30% of income',
      });
    });

    // 20% for savings
    recommendations.push({
      category: 'Savings & Investments',
      recommendedAmount: totalIncome * 0.2,
      currentSpending: categorySpending.get('Savings & Investments') || 0,
      percentageOfIncome: 20,
      reasoning: 'Based on the 50/30/20 rule - savings and investments should be 20% of income',
    });

    return recommendations;
  }

  /**
   * Generate AI insights about spending patterns
   */
  private static async generateInsights(
    categorySpending: Map<string, number>,
    totalIncome: number,
    totalExpenses: number,
    savingsRate: number
  ): Promise<string> {
    try {
      const spendingData = Array.from(categorySpending.entries())
        .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
        .join(', ');

      const prompt = `Analyze this monthly financial summary and provide 3-4 key insights and actionable recommendations.

Monthly Income: $${totalIncome.toFixed(2)}
Monthly Expenses: $${totalExpenses.toFixed(2)}
Savings Rate: ${savingsRate.toFixed(1)}%
Spending: ${spendingData}

Provide concise, actionable insights in 3-4 bullet points. Focus on areas of concern and opportunities for improvement.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor providing personalized insights. Be encouraging but honest about areas needing improvement.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content?.trim() || 'No insights available at this time.';
    } catch (error) {
      console.error('AI insights error:', error);
      return `Your savings rate is ${savingsRate.toFixed(1)}%. Consider reviewing your spending to increase savings.`;
    }
  }
}
