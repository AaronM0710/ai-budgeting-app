/**
 * Database Configuration
 *
 * This file sets up the connection to PostgreSQL database.
 * We use the 'pg' library (node-postgres) to connect.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
// A pool manages multiple database connections for better performance
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if connection takes > 2 seconds
});

// Test the database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Helper function to run queries
 * This is a wrapper around pool.query for easier use
 */
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
