import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { uploadFile } from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', verifyToken(), uploadFile); // NOT use multer here

export default router;
