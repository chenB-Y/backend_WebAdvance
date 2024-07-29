import express from 'express';
const router = express.Router();
import ProductController from '../controllers/product_controller';
import { authMiddleware } from '../controllers/auth_controller';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The Product API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve a list of products or a specific product by ID.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Product ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products or a specific product
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, ProductController.get.bind(ProductController));

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retrieve a product by ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  authMiddleware,
  ProductController.get.bind(ProductController)
);

/**
 * @swagger
 * /product/comments/{id}:
 *   get:
 *     summary: Retrieve comments for a specific product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get(
  '/comments/:id',
  authMiddleware,
  ProductController.getComments.bind(ProductController)
);

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  ProductController.post.bind(ProductController)
);

/**
 * @swagger
 * /product/update-product/{id}:
 *   put:
 *     summary: Update a product by ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(
  '/update-product/:id',
  authMiddleware,
  ProductController.put.bind(ProductController)
);

/**
 * @swagger
 * /product/addComment/{id}:
 *   post:
 *     summary: Add a comment to a product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               author:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comment added
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post(
  '/addComment/:id',
  authMiddleware,
  ProductController.postComment.bind(ProductController)
);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product by ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  authMiddleware,
  ProductController.delete.bind(ProductController)
);

export default router;
