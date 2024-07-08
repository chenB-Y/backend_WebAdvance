"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controllers/file_controller");
const router = express_1.default.Router();
// const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const base = 'http://localhost:3000/';
router.post('/uploadUser', file_controller_1.upload.single('file'), (req, res) => {
    try {
        const filePath = req.file.filename;
        res.status(200).send({ url: base + filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
router.post('/uploadProduct', file_controller_1.productUpload.single('file'), (req, res) => {
    try {
        const filePath = req.file.filename;
        res.status(200).send({ url: base + filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
exports.default = router;
//# sourceMappingURL=file_route.js.map