import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', verifyToken(), getDashboardSummary);

export default router;
