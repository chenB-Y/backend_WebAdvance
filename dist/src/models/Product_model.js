"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    comments: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Comment' }],
    },
});
const Product = (0, mongoose_1.model)('Product', ProductSchema);
exports.default = Product;
//# sourceMappingURL=Product_model.js.map