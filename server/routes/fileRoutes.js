import express from 'express';
import { uploadFile } from '../controllers/fileController.js';

const router = express.Router();

// POST /api/files/upload
router.post('/upload', uploadFile);

export default router;
