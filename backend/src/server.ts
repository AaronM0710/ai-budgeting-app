/**
 * Main Server File
 *
 * This is the entry point of our application.
 * It sets up Express, middleware, routes, and starts the server.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import waitlistRoutes from './routes/waitlistRoutes';
import { pool } from './config/database';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ===== SECURITY MIDDLEWARE =====

// Helmet: Sets various HTTP headers for security
app.use(helmet());

// CORS: Allow requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ===== GENERAL MIDDLEWARE =====

// Morgan: HTTP request logger
app.use(morgan('dev'));

// Body parsers
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ===== ROUTES =====

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/waitlist', waitlistRoutes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// ===== ERROR HANDLER =====

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Multer errors (file upload)
  if (err.message.includes('Only PDF and CSV files')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message.includes('File too large')) {
    res.status(413).json({ error: 'File size exceeds 10MB limit' });
    return;
  }

  // Generic error response
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ===== START SERVER =====

// Test database connection before starting
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
