import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { uploadFile, getMyFiles } from '../controllers/fileController.js';
import { downloadFile } from '../controllers/fileController.js';

const router = express.Router();

router.get('/mine',verifyToken(),getMyFiles);
router.post('/upload', verifyToken(), uploadFile); 
router.get('/:id/download', verifyToken(['admin', 'employee']), downloadFile);

export default router;
