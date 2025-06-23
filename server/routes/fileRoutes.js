import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { uploadFile, getMyFiles } from '../controllers/fileController.js';

const router = express.Router();

router.get('/mine',verifyToken(),getMyFiles);
router.post('/upload', verifyToken(), uploadFile); 

export default router;
