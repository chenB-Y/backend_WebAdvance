import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure the directory exists
const uploadDirectory = path.join('./pictures');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path; // Path to the uploaded file
    res.status(200).send({ url: filePath });
  } catch (err) {
    res.status(500).send({ error: 'Failed to upload file' });
  }
});

export default router;
