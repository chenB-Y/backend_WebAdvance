import express from 'express';
import { upload, productUpload } from '../controllers/file_controller';
const router = express.Router();

const base = "https://10.10.248.174:4000/";
//const base = 'http://localhost:3000/';

router.post('/uploadUser', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.filename;
    res.status(200).send({ url: base + filePath });
  } catch (err) {
    res.status(500).send({ error: 'Failed to upload file' });
  }
});

router.post('/uploadProduct', productUpload.single('file'), (req, res) => {
  try {
    const filePath = req.file.filename;
    console.log('77777777777777777777777777777777777777777777777777777777777' + filePath)
    res.status(200).send({ url: base + filePath });
  } catch (err) {
    res.status(500).send({ error: 'Failed to upload file' });
  }
});

export default router;
