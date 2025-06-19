import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getAllEmployees } from '../controllers/adminController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route (login)
router.post('/login', login);

// Protected admin-only route to register EmgetAllEmployees
router.post('/register', verifyToken(['admin']), register);

// Admin-only route to fetch user list
router.get('/admin/employees', verifyToken(['admin']), getAllEmployees);

export default router;
