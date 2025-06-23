import express from 'express';
import { updateEmployeeStatus, updateEmployeeInfo } from '../controllers/adminController.js';
import { getAllEmployees } from '../controllers/adminController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

//update status
router.put('/employees/:id/status', verifyToken(['admin']), updateEmployeeStatus);
// Update full info
router.put('/employees/:id', verifyToken(['admin']), updateEmployeeInfo);

router.get('/employees', verifyToken(['admin']), getAllEmployees);

export default router;