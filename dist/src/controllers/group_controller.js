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
exports.deleteGroup = exports.addProduct = exports.updateGroup = exports.getGroupByName = exports.createGroup = void 0;
const group_model_1 = __importDefault(require("../models/group_model"));
const Product_model_1 = __importDefault(require("../models/Product_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const Server_1 = require("../Server");
// Create a new group
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newGroup = yield group_model_1.default.create(req.body);
        const response = yield user_model_1.default.findById(req.body.participants);
        response.groupID = newGroup._id.toString();
        response.save();
        res.status(201).json(newGroup);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
});
exports.createGroup = createGroup;
const getGroupByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    try {
        console.log('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
        const group = yield group_model_1.default.findById(req.params.id).populate('products');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching group', error });
    }
});
exports.getGroupByName = getGroupByName;
// Update a group by Name
const updateGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_model_1.default.findOne({ name: req.params.name });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.participants.push(req.body.userID);
        console.log(req.body.userID);
        const response = yield user_model_1.default.findById(req.body.userID);
        response.groupID = group._id.toString();
        response.save();
        const updatedGroup = yield group.save();
        res.status(200).json(updatedGroup);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating group', error });
    }
});
exports.updateGroup = updateGroup;
// Add Product by group name
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_model_1.default.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const mod = req.body;
        try {
            const newProduct = yield Product_model_1.default.create(mod);
            group.products.push(newProduct.id);
            const updatedGroup = yield group.save();
            (0, Server_1.broadcast)({ type: `PRODUCT_ADDED:${group._id}`, newProduct });
            res.status(200).json(updatedGroup);
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating group', error });
    }
});
exports.addProduct = addProduct;
// Delete a group by ID
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedGroup = yield group_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Group deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting group', error });
    }
});
exports.deleteGroup = deleteGroup;
exports.default = {
    createGroup: exports.createGroup,
    getGroupByName: exports.getGroupByName,
    updateGroup: exports.updateGroup,
    addProduct: exports.addProduct,
    deleteGroup: exports.deleteGroup,
};
//# sourceMappingURL=group_controller.js.map