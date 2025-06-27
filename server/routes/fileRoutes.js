import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { 
  uploadFile, 
  getMyFiles, 
  downloadFile, 
  deleteFile 
} from '../controllers/fileController.js';

const router = express.Router();

// Route to get user's files
router.get('/mine', verifyToken(), getMyFiles);

// Route to upload files
router.post('/upload', verifyToken(), uploadFile);

// Route to download a file
router.get('/:id/download', verifyToken(), downloadFile);

// Route to delete a file - FIXED (added parentheses for verifyToken)
router.delete('/:id', verifyToken(), deleteFile);

export default router;