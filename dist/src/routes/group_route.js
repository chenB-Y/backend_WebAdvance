"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const group_controller_1 = __importDefault(require("../controllers/group_controller"));
// implementation of the group route
router.get('/getGroup/:id', group_controller_1.default.getGroupByName);
router.post('/createGroup', group_controller_1.default.createGroup);
router.put('/updateGroup/:name', group_controller_1.default.updateGroup);
router.post('/addProduct/:id', group_controller_1.default.addProduct);
router.delete('/deleteGroup/:id', group_controller_1.default.deleteGroup);
exports.default = router;
//# sourceMappingURL=group_route.js.map