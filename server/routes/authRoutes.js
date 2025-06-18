// routes/authRoutes.js
import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { register, login } from '../controllers/authController.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected admin routes
router.get('/admin/dashboard',  // Note the /admin prefix
  verifyToken(['admin']),
  getAdminDashboard
);

export default router;