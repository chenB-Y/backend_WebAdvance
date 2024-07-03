import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directory exists
const uploadDirectory = path.join('./public');
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

export default upload;
