import express from 'express';
import { updateEmployeeStatus, updateEmployeeInfo } from '../controllers/adminController.js';
import { getAllEmployees } from '../controllers/adminController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();
 
router.put('/employees/:id/status', verifyToken(['admin']), updateEmployeeStatus); 

router.put('/employees/:id', verifyToken(['admin']), updateEmployeeInfo);

router.get('/employees', verifyToken(['admin']), getAllEmployees);

export default router;