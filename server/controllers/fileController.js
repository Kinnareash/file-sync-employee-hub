import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).array('files');

export const uploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }

    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: req.files
    });
  });
};
