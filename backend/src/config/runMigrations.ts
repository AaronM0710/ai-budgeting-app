/**
 * Database Migration Runner
 *
 * This script reads the schema.sql file and creates all tables.
 * Run this with: npm run migrate
 */

import fs from 'fs';
import path from 'path';
import { pool } from './database';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migration...');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);

    console.log('✅ Database migration completed successfully!');
    console.log('📊 All tables have been created.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
