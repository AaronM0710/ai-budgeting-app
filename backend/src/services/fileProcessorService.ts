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
    if (mimeType === 'application/pdf') {
      return this.processPDF(filePath);
    } else if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
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
   */
  private static parseTransactionsFromText(text: string): ExtractedTransaction[] {
    const transactions: ExtractedTransaction[] = [];
    const lines = text.split('\n');

    // Common bank statement patterns
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(\d{4}[-/]\d{1,2}[-/]\d{1,2})/;
    const amountPattern = /\$?\s*-?\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Look for date pattern
      const dateMatch = line.match(datePattern);
      if (!dateMatch) continue;

      // Look for amount in the same line or next line
      const amountMatch = line.match(amountPattern) ||
                         (i + 1 < lines.length ? lines[i + 1].match(amountPattern) : null);

      if (!amountMatch) continue;

      // Extract description (everything between date and amount)
      let description = line
        .replace(datePattern, '')
        .replace(amountPattern, '')
        .trim();

      if (!description && i + 1 < lines.length) {
        description = lines[i + 1].replace(amountPattern, '').trim();
      }

      const amountStr = amountMatch[1].replace(/,/g, '');
      const amount = parseFloat(amountStr);

      if (!isNaN(amount) && amount > 0) {
        transactions.push({
          date: this.normalizeDate(dateMatch[0]),
          description: description || 'Unknown transaction',
          amount: amount,
          isIncome: line.includes('CREDIT') || line.includes('DEPOSIT') || amount < 0,
        });
      }
    }

    return transactions;
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
