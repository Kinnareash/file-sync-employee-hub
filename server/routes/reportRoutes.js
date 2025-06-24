import express from 'express';
import { getUploadedReport } from '../controllers/reportController.js';
import verifyToken  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/uploaded', verifyToken(['admin']), getUploadedReport);

export default router;
