"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_model_1 = __importDefault(require("../models/Product_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
class ProductController extends base_controller_1.default {
    constructor() {
        super(Product_model_1.default);
    }
}
exports.default = new ProductController;
//# sourceMappingURL=product_controller.js.map