import express from 'express';
import { getAllUsers, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/all (admin-only in future)
router.get('/all', getAllUsers);

// GET /api/users/me
router.get('/me', getUserProfile);

export default router;
