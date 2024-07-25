"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const product_controller_1 = __importDefault(require("../controllers/product_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
//router.get('/', authMiddleware, ProductController.get.bind(ProductController));
router.get('/', auth_controller_1.authMiddleware, product_controller_1.default.get.bind(product_controller_1.default));
router.get('/:id', auth_controller_1.authMiddleware, product_controller_1.default.get.bind(product_controller_1.default));
router.get('/comments/:id', auth_controller_1.authMiddleware, product_controller_1.default.getComments.bind(product_controller_1.default));
router.post('/', auth_controller_1.authMiddleware, product_controller_1.default.post.bind(product_controller_1.default));
router.put('/update-product/:id', auth_controller_1.authMiddleware, product_controller_1.default.put.bind(product_controller_1.default));
router.post('/addComment/:id', auth_controller_1.authMiddleware, product_controller_1.default.postComment.bind(product_controller_1.default));
router.delete('/:id', auth_controller_1.authMiddleware, product_controller_1.default.delete.bind(product_controller_1.default));
exports.default = router;
//# sourceMappingURL=product_route.js.map