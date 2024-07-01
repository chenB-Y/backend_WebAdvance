"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Ensure the directory exists
const uploadDirectory = path_1.default.join('./pictures');
if (!fs_1.default.existsSync(uploadDirectory)) {
    fs_1.default.mkdirSync(uploadDirectory, { recursive: true });
}
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.path; // Path to the uploaded file
        res.status(200).send({ url: filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
exports.default = router;
//# sourceMappingURL=file_route.js.map