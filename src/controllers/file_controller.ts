import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directory exists
const uploadUserDirectory = path.join('./public/users');
if (!fs.existsSync(uploadUserDirectory)) {
  fs.mkdirSync(uploadUserDirectory, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadUserDirectory); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Generate a unique filename
  },
});

const uploadProductDirectory = path.join('./public/products');
if (!fs.existsSync(uploadProductDirectory)) {
  fs.mkdirSync(uploadProductDirectory, { recursive: true });
}

// Configure multer for file uploads
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadProductDirectory); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage });

const productUpload = multer({ storage: productStorage });

export { upload, productUpload };
