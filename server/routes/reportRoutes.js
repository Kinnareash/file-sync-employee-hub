import express from 'express';
import { getComplianceReport } from '../controllers/reportController.js';
import verifyToken  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/compliance', verifyToken(['admin']), getComplianceReport);

export default router;
