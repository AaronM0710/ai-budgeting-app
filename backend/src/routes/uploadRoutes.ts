/**
 * Upload Routes
 *
 * These define the API endpoints for file uploads:
 * - POST /api/upload - Upload a bank statement
 * - GET /api/upload/files - Get user's files
 * - DELETE /api/upload/:fileId - Delete a file
 */

import express from 'express';
import { UploadController, upload } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All upload routes require authentication
router.use(authenticateToken);

// Upload a file
router.post(
  '/',
  upload.single('file'), // 'file' is the form field name
  UploadController.uploadFile
);

// Get user's uploaded files
router.get('/files', UploadController.getUserFiles);

// Delete a file
router.delete('/:fileId', UploadController.deleteFile);

export default router;
