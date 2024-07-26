"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_model_1 = __importDefault(require("../models/Product_model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const comment_model_1 = __importDefault(require("../models/comment_model"));
const websocketServer_1 = require("../websocketServer");
const group_model_1 = __importDefault(require("../models/group_model"));
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id != null) {
                    const models = yield this.model.findById(req.params.id);
                    res.status(200).send(models);
                }
                else {
                    if (req.query.name != null) {
                        const models = yield this.model.find({ name: req.query.name });
                        res.status(200).send(models);
                    }
                    else {
                        const models = yield this.model.find();
                        res.status(200).send(models);
                    }
                }
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    // ****************NOT IN USE!!! the product addes in the group controller****************** //
    // Post should be used to create a new product
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('**************************************req.body:', req.body);
            const mod = req.body;
            try {
                const newProduct = yield this.model.create(mod);
                console.log('99999999999999922222222222222222222222999999999999999999999');
                (0, websocketServer_1.broadcast)({ type: 'PRODUCT_ADDED', newProduct });
                console.log('333333333333333333311111111111111111111111111111133333333333333');
                res.status(201).json(newProduct);
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield Product_model_1.default.findById(req.params.id).populate('comments');
                //console.log('**************************************product:', product);
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json(product);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching comments', error });
            }
        });
    }
    postComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log('**************************************req.body:', req.body);
                const product = yield Product_model_1.default.findById(req.params.id);
                console.log('22222222222222222222222');
                if (!product) {
                    console.log('3333333333333333333');
                    return res.status(404).json({ message: 'Product not found' });
                }
                try {
                    console.log('4444444444444444444444');
                    console.log('req.body:', req.body);
                    const newComment = yield comment_model_1.default.create(req.body);
                    console.log('5555555555555555555555');
                    product.comments.push(newComment.id);
                    console.log('6666666666666666666666');
                    const updatedProduct = yield product.save();
                    console.log('7777777777777777777777');
                    (0, websocketServer_1.broadcast)({
                        type: 'COMMENT_ADDED',
                        productId: req.params.id,
                        comment: newComment,
                    });
                    res.status(200).json(updatedProduct);
                }
                catch (err) {
                    res.status(500).send(err.message);
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating group', error });
            }
        });
    }
    // Put should be used to update a product
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id != null) {
                const product = yield Product_model_1.default.findById(req.params.id);
                const mod = req.body;
                //console.log(
                //'**************************************req.body:',
                //  req.body.imageUrl
                //);
                //console.log(
                // '**************************************product:',
                // product.imageUrl
                //);
                try {
                    console.log('*********mod:', mod);
                    console.log('*********/************************:', mod.imageUrl);
                    // If there's a current image URL, remove the old image file
                    if (product.imageUrl !== mod.imageUrl) {
                        const imagePath = path_1.default.join('./public/products', product.imageUrl.split('10.10.248.174:4000/')[1]);
                        fs_1.default.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Error deleting old image:', err);
                            }
                            else {
                                console.log('Old image deleted:', imagePath);
                            }
                        });
                    }
                    if (mod.name)
                        product.name = mod.name;
                    if (mod.amount)
                        product.amount = mod.amount;
                    if (product.imageUrl !== mod.imageUrl)
                        product.imageUrl = mod.imageUrl;
                    const updatedModel = yield product.save();
                    (0, websocketServer_1.broadcast)({ type: 'PRODUCT_UPDATED', product: updatedModel });
                    res.status(200).json(updatedModel);
                }
                catch (err) {
                    res.status(500).send(err.message);
                }
            }
            else {
                res.status(400).send('There is no product with this ID');
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productID = new mongoose_1.default.Types.ObjectId(req.params.id);
                // Find the product by ID
                const product = yield Product_model_1.default.findById(productID);
                // If the product is not found, return an error
                if (!product) {
                    return res.status(404).json({ message: `Product with id: ${productID} not found` });
                }
                const ownerId = product.ownerId;
                // Loop through the comments array in the product
                for (const commentID of product.comments) {
                    // Delete each comment from the Comments collection
                    yield comment_model_1.default.findByIdAndDelete(commentID);
                }
                const imageUrl = product.imageUrl;
                if (imageUrl) {
                    const filename = path_1.default.basename(imageUrl);
                    const imagePath = path_1.default.join(__dirname, '..', '..', 'public', 'products', filename);
                    console.log("path: " + imagePath);
                    // Delete the image file
                    fs_1.default.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`Error deleting image file ${imageUrl}: ${err}`);
                        }
                        else {
                            console.log(`Deleted image file ${imageUrl}`);
                        }
                    });
                }
                // Delete the product
                yield Product_model_1.default.findByIdAndDelete(productID);
                const group = yield group_model_1.default.findOne({ participants: ownerId });
                if (group) {
                    // Filter out the product from the group's products array
                    group.products = group.products.filter(productId => productId.toString() !== productID.toString());
                    yield group.save();
                }
                // Broadcast the deletion event
                (0, websocketServer_1.broadcast)({ type: 'PRODUCT_DELETED', productId: productID });
                // Return a success message
                res.status(200).json(`Product with id: ${productID} deleted along with its comments`);
            }
            catch (err) {
                // Handle any errors
                res.status(500).send(err.message);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=base_controller.js.map