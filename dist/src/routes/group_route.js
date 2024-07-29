"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const group_controller_1 = __importDefault(require("../controllers/group_controller"));
const auth_controller_1 = require("../controllers/auth_controller");
/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: API to manage groups
 */
/**
 * @swagger
 * /group/getGroup/{id}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The group's ID
 *                 name:
 *                   type: string
 *                   description: The group's name
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs in the group
 *                 products:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of product IDs in the group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get('/getGroup/:id', auth_controller_1.authMiddleware, group_controller_1.default.getGroupByName);
/**
 * @swagger
 * /group/createGroup:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the group
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs to add to the group
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The group's ID
 *                 name:
 *                   type: string
 *                   description: The group's name
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs in the group
 *       500:
 *         description: Server error
 */
router.post('/createGroup', auth_controller_1.authMiddleware, group_controller_1.default.createGroup);
/**
 * @swagger
 * /group/updateGroup/{name}:
 *   put:
 *     summary: Update a group by name
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the group to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *                 description: The user ID to add to the group
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The group's ID
 *                 name:
 *                   type: string
 *                   description: The group's name
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs in the group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.put('/updateGroup/:name', auth_controller_1.authMiddleware, group_controller_1.default.updateGroup);
/**
 * @swagger
 * /group/addProduct/{id}:
 *   post:
 *     summary: Add a product to a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group to add the product to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               amount:
 *                 type: number
 *                 description: The amount of the product
 *               imageUrl:
 *                 type: string
 *                 description: URL of the product image
 *               ownerId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The product's ID
 *                 name:
 *                   type: string
 *                   description: The product's name
 *                 amount:
 *                   type: number
 *                   description: The product's amount
 *                 imageUrl:
 *                   type: string
 *                   description: The URL of the product image
 *                 ownerId:
 *                   type: string
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.post('/addProduct/:id', auth_controller_1.authMiddleware, group_controller_1.default.addProduct);
/**
 * @swagger
 * /group/deleteGroup/{id}:
 *   delete:
 *     summary: Delete a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteGroup/:id', auth_controller_1.authMiddleware, group_controller_1.default.deleteGroup);
exports.default = router;
//# sourceMappingURL=group_route.js.map