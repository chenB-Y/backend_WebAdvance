"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controllers/file_controller");
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
const base = 'https://10.10.248.174:4000/';
//const base = 'http://localhost:3000/';
/**
 * @swagger
 * tags:
 *   name: Files
 *   description: API to upload files
 */
/**
 * @swagger
 * /file/uploadUser:
 *   post:
 *     summary: Upload a user file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 *       500:
 *         description: Failed to upload file
 */
router.post('/uploadUser', file_controller_1.upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.filename;
        res.status(200).send({ url: base + filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
/**
 * @swagger
 * /file/uploadProduct:
 *   post:
 *     summary: Upload a product file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 *       500:
 *         description: Failed to upload file
 */
router.post('/uploadProduct', auth_controller_1.authMiddleware, file_controller_1.productUpload.single('file'), (req, res) => {
    try {
        const filePath = req.file.filename;
        console.log('77777777777777777777777777777777777777777777777777777777777' + filePath);
        res.status(200).send({ url: base + filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
exports.default = router;
//# sourceMappingURL=file_route.js.map