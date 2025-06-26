import { pool } from '../models/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMiddleware = multer({ storage }).array('files');

// Exported controller
// const upload = multer({ storage }).array('files');
export const uploadFile = (req, res) => {
  console.log("📦 Upload endpoint called");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(" Multer error:", err);
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }

    console.log('Body:', req.body);
    console.log('Files:', req.files);


    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user ID missing' });
    }

    const { category, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const insertedFiles = [];

      for (const file of req.files) {
        const { filename, path: filePath, mimetype, size } = file;
        const normalizedPath = path.normalize(filePath).replace(/\\/g, '/');

        const result = await pool.query(
          `INSERT INTO files (filename, filepath, mimetype, size, user_id, category, description, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'uploaded')
           RETURNING *`,
          [filename, normalizedPath, mimetype, size, userId, category, description]
        );

        insertedFiles.push(result.rows[0]);
      }

      return res.status(201).json({
        message: 'Files uploaded successfully',
        files: insertedFiles
      });

    } catch (dbError) {
      console.error(" DB error:", dbError);
      return res.status(500).json({ message: 'Database error', error: dbError.message });
    }
  });
};

export const getMyFiles = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: user ID missing' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM files WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json({ files: result.rows });

  } catch (err) {
    console.error(" Error fetching files:", err);
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export const downloadFile = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT user_id,
              filename AS stored_filename,
              filename AS original_filename
       FROM files
       WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = rows[0];

    if (req.user.role !== 'admin' && file.user_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const filePath = path.resolve('uploads', file.stored_filename);
    return res.download(filePath, file.original_filename);
  } catch (err) {
    console.error('Download error:', err);
    return res.status(500).json({ message: 'Download failed' });
  }
};
