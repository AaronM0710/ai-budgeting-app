/**
 * File Processor Service
 *
 * Handles extraction of transactions from PDF and CSV files
 */

const PDFParser = require('pdf2json');
import fs from 'fs';
import csv from 'csv-parser';
import { Readable } from 'stream';

export interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  isIncome: boolean;
}

export class FileProcessorService {
  /**
   * Process uploaded file and extract transactions
   */
  static async processFile(filePath: string, mimeType: string): Promise<ExtractedTransaction[]> {
    // Check for PDF
    if (mimeType === 'application/pdf') {
      return this.processPDF(filePath);
    }

    // Check for CSV (various mime types depending on OS/browser)
    const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/octet-stream', 'text/plain'];
    if (csvMimeTypes.includes(mimeType) || filePath.toLowerCase().endsWith('.csv')) {
      return this.processCSV(filePath);
    }

    throw new Error('Unsupported file type');
  }

  /**
   * Extract transactions from PDF using text extraction
   */
  private static async processPDF(filePath: string): Promise<ExtractedTransaction[]> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(errData.parserError));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        // Extract text from PDF
        let text = '';
        pdfData.Pages.forEach((page: any) => {
          page.Texts.forEach((textItem: any) => {
            text += decodeURIComponent(textItem.R[0].T) + ' ';
          });
          text += '\n';
        });

        // Parse transactions from text
        const transactions = this.parseTransactionsFromText(text);
        resolve(transactions);
      });

      pdfParser.loadPDF(filePath);
    });
  }

  /**
   * Extract transactions from CSV
   */
  private static async processCSV(filePath: string): Promise<ExtractedTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: ExtractedTransaction[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Common CSV formats have: Date, Description, Amount
            const transaction = this.parseCSVRow(row);
            if (transaction) {
              transactions.push(transaction);
            }
          } catch (error) {
            console.error('Error parsing CSV row:', error);
          }
        })
        .on('end', () => {
          resolve(transactions);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Parse CSV row into transaction
   */
  private static parseCSVRow(row: any): ExtractedTransaction | null {
    // Try common CSV column names
    const dateKeys = ['Date', 'date', 'Transaction Date', 'Posting Date', 'posting_date'];
    const descKeys = ['Description', 'description', 'Merchant', 'merchant', 'Details', 'details'];
    const amountKeys = ['Amount', 'amount', 'Debit', 'debit', 'Credit', 'credit'];

    const date = this.findValue(row, dateKeys);
    const description = this.findValue(row, descKeys);
    const amountStr = this.findValue(row, amountKeys);

    if (!date || !description || !amountStr) {
      return null;
    }

    const amount = parseFloat(amountStr.toString().replace(/[$,]/g, ''));
    if (isNaN(amount)) {
      return null;
    }

    return {
      date: this.normalizeDate(date.toString()),
      description: description.toString().trim(),
      amount: Math.abs(amount),
      isIncome: amount > 0,
    };
  }

  /**
   * Find value from row using multiple possible keys
   */
  private static findValue(row: any, keys: string[]): any {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    return null;
  }

  /**
   * Parse transactions from PDF text
   * Improved with multiple parsing strategies for different bank formats
   */
  private static parseTransactionsFromText(text: string): ExtractedTransaction[] {
    // Try multiple parsing strategies
    let transactions = this.parseStrategy1(text);  // Standard format

    if (transactions.length === 0) {
      transactions = this.parseStrategy2(text);  // Alternative format
    }

    if (transactions.length === 0) {
      transactions = this.parseStrategy3(text);  // Line-by-line fallback
    }

    // Deduplicate and validate
    return this.deduplicateTransactions(transactions);
  }

  /**
   * Strategy 1: Standard bank statement format
   * Format: DATE DESCRIPTION AMOUNT
   */
  private static parseStrategy1(text: string): ExtractedTransaction[] {
    const transactions: ExtractedTransaction[] = [];
    const lines = text.split('\n');

    // Multiple date patterns for different formats
    const datePatterns = [
      /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b/,           // MM/DD/YYYY or DD-MM-YYYY
      /\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/,              // YYYY-MM-DD
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s*\d{4}/i,  // Jan 15, 2024
      /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/i,    // 15 Jan 2024
    ];

    // Amount patterns - capture negative signs and parentheses for debits
    const amountPatterns = [
      /\$?\s*(-?\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,        // $1,234.56 at end of line
      /\(\$?\s*(\d{1,3}(?:,\d{3})*\.\d{2})\)/,          // ($1,234.56) - debit format
      /\$?\s*(-?\d{1,3}(?:,\d{3})*\.\d{2})\s*[DC]?$/i,  // Amount with D/C indicator
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.length < 10) continue;

      // Skip header lines and summaries
      if (this.isHeaderOrSummaryLine(line)) continue;

      // Find date
      let dateMatch = null;
      for (const pattern of datePatterns) {
        dateMatch = line.match(pattern);
        if (dateMatch) break;
      }
      if (!dateMatch) continue;

      // Find amount - check current line and next line
      let amountMatch = null;
      let amountLine = line;
      for (const pattern of amountPatterns) {
        amountMatch = line.match(pattern);
        if (amountMatch) break;
      }

      if (!amountMatch && i + 1 < lines.length) {
        amountLine = lines[i + 1].trim();
        for (const pattern of amountPatterns) {
          amountMatch = amountLine.match(pattern);
          if (amountMatch) break;
        }
      }

      if (!amountMatch) continue;

      // Extract description
      let description = line
        .replace(dateMatch[0], '')
        .replace(/\$?\s*-?\d{1,3}(?:,\d{3})*\.\d{2}/g, '')
        .replace(/\([^)]*\)/g, '')  // Remove parenthetical amounts
        .trim();

      // Clean up description
      description = this.cleanDescription(description);
      if (!description) description = 'Unknown transaction';

      // Parse amount
      const amountStr = amountMatch[1].replace(/[$,]/g, '');
      const amount = Math.abs(parseFloat(amountStr));

      if (isNaN(amount) || amount === 0) continue;

      // Determine if income
      const isDebit = line.includes('(') && line.includes(')') && amountMatch[0].includes('(');
      const isIncome = this.isIncomeTransaction(line, description, isDebit);

      transactions.push({
        date: this.normalizeDate(dateMatch[0]),
        description,
        amount,
        isIncome,
      });
    }

    return transactions;
  }

  /**
   * Strategy 2: Multi-column format (separate debit/credit columns)
   */
  private static parseStrategy2(text: string): ExtractedTransaction[] {
    const transactions: ExtractedTransaction[] = [];

    // Split into lines and look for table-like structure
    const lines = text.split('\n').filter(l => l.trim());

    // Look for patterns with multiple amounts (debit and credit columns)
    const multiAmountPattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}).+?(\d+\.\d{2}).*?(\d+\.\d{2})?/;

    for (const line of lines) {
      const match = line.match(multiAmountPattern);
      if (!match) continue;

      const date = match[1];
      const amount1 = parseFloat(match[2]);
      const amount2 = match[3] ? parseFloat(match[3]) : null;

      // Extract description (text between date and first amount)
      const dateIndex = line.indexOf(match[1]);
      const amountIndex = line.indexOf(match[2]);
      let description = line.substring(dateIndex + match[1].length, amountIndex).trim();
      description = this.cleanDescription(description);

      if (!description || description.length < 2) continue;

      // If we have two amounts, one is likely debit and one credit
      if (amount2 !== null && amount2 > 0) {
        // Use the non-zero amount
        const finalAmount = amount1 > 0 ? amount1 : amount2;
        const isIncome = amount2 > 0 && amount1 === 0; // Credit column has value

        transactions.push({
          date: this.normalizeDate(date),
          description,
          amount: finalAmount,
          isIncome,
        });
      } else if (amount1 > 0) {
        transactions.push({
          date: this.normalizeDate(date),
          description,
          amount: amount1,
          isIncome: this.isIncomeTransaction(line, description, false),
        });
      }
    }

    return transactions;
  }

  /**
   * Strategy 3: Aggressive line-by-line parsing (fallback)
   */
  private static parseStrategy3(text: string): ExtractedTransaction[] {
    const transactions: ExtractedTransaction[] = [];

    // Very flexible patterns
    const datePattern = /\b(\d{1,2}[-/]\d{1,2}(?:[-/]\d{2,4})?)\b/;
    const amountPattern = /\$?\s*(-?\d+\.?\d*)/g;

    const lines = text.split(/[\n\r]+/).filter(l => l.trim().length > 5);

    for (const line of lines) {
      if (this.isHeaderOrSummaryLine(line)) continue;

      const dateMatch = line.match(datePattern);
      if (!dateMatch) continue;

      // Find all numbers that look like amounts
      const amounts: number[] = [];
      let match;
      const amountRegex = /\$?\s*(-?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
      while ((match = amountRegex.exec(line)) !== null) {
        const num = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(num) && num !== 0 && num < 1000000) {
          amounts.push(num);
        }
      }

      if (amounts.length === 0) continue;

      // Use the last amount (usually the transaction amount)
      const amount = Math.abs(amounts[amounts.length - 1]);

      // Extract description
      let description = line
        .replace(datePattern, '')
        .replace(/\$?\s*-?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g, '')
        .trim();

      description = this.cleanDescription(description);
      if (!description || description.length < 2) continue;

      transactions.push({
        date: this.normalizeDate(dateMatch[1]),
        description,
        amount,
        isIncome: this.isIncomeTransaction(line, description, false),
      });
    }

    return transactions;
  }

  /**
   * Clean up transaction description
   */
  private static cleanDescription(desc: string): string {
    return desc
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .replace(/^[-*•·]\s*/, '')      // Remove leading bullets
      .replace(/\s*[-*•·]$/, '')      // Remove trailing bullets
      .replace(/^\d+\s+/, '')         // Remove leading numbers
      .replace(/\s+\d+$/, '')         // Remove trailing numbers
      .trim();
  }

  /**
   * Determine if a transaction is income
   */
  private static isIncomeTransaction(line: string, description: string, isDebit: boolean): boolean {
    const lowerLine = (line + ' ' + description).toLowerCase();

    // Keywords indicating income
    const incomeKeywords = [
      'deposit', 'credit', 'refund', 'payment received', 'direct dep',
      'payroll', 'salary', 'income', 'interest earned', 'dividend',
      'cash back', 'reimbursement', 'transfer from', 'venmo from',
      'zelle from', 'paypal from'
    ];

    for (const keyword of incomeKeywords) {
      if (lowerLine.includes(keyword)) {
        return true;
      }
    }

    return !isDebit && lowerLine.includes('+');
  }

  /**
   * Check if line is a header or summary (should be skipped)
   */
  private static isHeaderOrSummaryLine(line: string): boolean {
    const lower = line.toLowerCase();
    const skipPatterns = [
      'balance', 'total', 'subtotal', 'page', 'statement',
      'account number', 'routing', 'opening', 'closing',
      'previous', 'date', 'description', 'amount', 'debit', 'credit',
      'beginning', 'ending', 'summary', 'period'
    ];

    return skipPatterns.some(p => lower.includes(p) && line.split(/\s+/).length < 5);
  }

  /**
   * Remove duplicate transactions
   */
  private static deduplicateTransactions(transactions: ExtractedTransaction[]): ExtractedTransaction[] {
    const seen = new Set<string>();
    return transactions.filter(t => {
      const key = `${t.date}-${t.description}-${t.amount}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Normalize date to YYYY-MM-DD format
   */
  private static normalizeDate(dateStr: string): string {
    // Remove any extra whitespace
    dateStr = dateStr.trim();

    // Try to parse the date
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      // If parsing failed, return today's date as fallback
      return new Date().toISOString().split('T')[0];
    }

    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  }
}
