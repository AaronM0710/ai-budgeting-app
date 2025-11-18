/**
 * File Upload Controller
 *
 * Handles bank statement uploads.
 * In production, files go to AWS S3. For now, they go to local storage.
 */

import { Request, Response } from 'express';
import { query } from '../config/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Configure Multer for file uploads
 * Multer is middleware that handles multipart/form-data (file uploads)
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: userid_timestamp_originalname
    const uniqueName = `${req.user?.userId}_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter: Only allow PDFs and CSVs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'text/csv', 'application/vnd.ms-excel'];
  const allowedExtensions = ['.pdf', '.csv'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and CSV files are allowed'));
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

export class UploadController {
  /**
   * Upload a bank statement
   * POST /api/upload
   */
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Save file metadata to database
      const result = await query(
        `INSERT INTO uploaded_files (user_id, original_filename, file_path, file_size, mime_type, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, original_filename, file_size, mime_type, status, uploaded_at`,
        [
          req.user.userId,
          req.file.originalname,
          req.file.path,
          req.file.size,
          req.file.mimetype,
          'pending',
        ]
      );

      const uploadedFile = result.rows[0];

      // TODO: In Phase 2, trigger the OCR processing pipeline here
      // For now, we just acknowledge the upload

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: uploadedFile.id,
          filename: uploadedFile.original_filename,
          size: uploadedFile.file_size,
          status: uploadedFile.status,
          uploaded_at: uploadedFile.uploaded_at,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  }

  /**
   * Get user's uploaded files
   * GET /api/upload/files
   */
  static async getUserFiles(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const result = await query(
        `SELECT id, original_filename, file_size, mime_type, status, uploaded_at, processed_at
         FROM uploaded_files
         WHERE user_id = $1 AND deleted_at IS NULL
         ORDER BY uploaded_at DESC`,
        [req.user.userId]
      );

      res.json({
        files: result.rows,
      });
    } catch (error) {
      console.error('Get files error:', error);
      res.status(500).json({ error: 'Failed to retrieve files' });
    }
  }

  /**
   * Delete a file
   * DELETE /api/upload/:fileId
   */
  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { fileId } = req.params;

      // Soft delete (for compliance - we can restore if needed)
      const result = await query(
        `UPDATE uploaded_files
         SET deleted_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [fileId, req.user.userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
}
