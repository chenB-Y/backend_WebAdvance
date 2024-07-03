"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = __importDefault(require("../controllers/file_controller"));
const router = express_1.default.Router();
router.post('/', file_controller_1.default.single('file'), (req, res) => {
    try {
        const filePath = req.file.filename;
        res.status(200).send({ url: filePath });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to upload file' });
    }
});
exports.default = router;
//# sourceMappingURL=file_route.js.map