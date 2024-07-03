import express from 'express';
import upload from '../controllers/file_controller';
const router = express.Router();

// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const base = 'http://localhost:3000/';

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.filename;
    res.status(200).send({ url: base + filePath });
  } catch (err) {
    res.status(500).send({ error: 'Failed to upload file' });
  }
});

export default router;
