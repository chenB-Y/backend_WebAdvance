"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const auth_controller_2 = require("../controllers/auth_controller");
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
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
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The newly registered user and tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, e.g., email or password missing
 *       500:
 *         description: Internal server error
 */
router.post('/register', auth_controller_1.default.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticates a user and returns tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Bad request, e.g., user not found or invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', auth_controller_1.default.login);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refreshes the access token using the refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Unauthorized, invalid or missing refresh token
 *       500:
 *         description: Internal server error
 */
router.get('/refresh', auth_controller_1.default.refresh);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs out the user by invalidating the refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized, invalid or missing refresh token
 *       500:
 *         description: Internal server error
 */
router.get('/logout', auth_controller_1.default.logout);
/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Signs in a user using Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google OAuth ID token
 *     responses:
 *       200:
 *         description: User data and tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 userID:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad request, e.g., invalid token or user not found
 *       500:
 *         description: Internal server error
 */
router.post('/google', auth_controller_1.default.googleSignin);
/**
 * @swagger
 * /auth/getUser/{id}:
 *   get:
 *     summary: Retrieves user data by ID
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 imgUrl:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUser/:id', auth_controller_2.authMiddleware, auth_controller_1.default.getUserData);
/**
 * @swagger
 * /auth/update-username:
 *   put:
 *     summary: Updates the user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               newUsername:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 imgUrl:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/update-username', auth_controller_2.authMiddleware, auth_controller_1.default.updateProfile);
exports.default = router;
//# sourceMappingURL=auth_route.js.map