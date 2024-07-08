"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure the directory exists
const uploadUserDirectory = path_1.default.join('./public/users');
if (!fs_1.default.existsSync(uploadUserDirectory)) {
    fs_1.default.mkdirSync(uploadUserDirectory, { recursive: true });
}
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadUserDirectory); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Generate a unique filename
    },
});
const uploadProductDirectory = path_1.default.join('./public/products');
if (!fs_1.default.existsSync(uploadProductDirectory)) {
    fs_1.default.mkdirSync(uploadProductDirectory, { recursive: true });
}
// Configure multer for file uploads
const productStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadProductDirectory); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Generate a unique filename
    },
});
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
const productUpload = (0, multer_1.default)({ storage: productStorage });
exports.productUpload = productUpload;
//# sourceMappingURL=file_controller.js.map