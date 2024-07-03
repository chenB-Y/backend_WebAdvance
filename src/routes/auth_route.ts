// add documentation to the all routes
import express from 'express';
const router = express.Router();
import AuthController from '../controllers/auth_controller';
import { authMiddleware } from '../controllers/auth_controller';

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
 *       bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *       User:
 *           type: object
 *           required:
 *              - email
 *              - password
 *           properties:
 *               email:
 *                   type: string
 *                   description: The user email
 *               password:
 *                   type: string
 *                   description: The user password
 *           example:
 *               email: 'bob@gmail.com'
 *               password: '123456'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *       summary: registers a new user
 *       tags: [Auth]
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 *       responses:
 *           200:
 *               description: The new user
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/User'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * components:
 *  schemas:
 *      Tokens:
 *          type: object
 *          required:
 *              - accessToken
 *              - refreshToken
 *          properties:
 *              accessToken:
 *                  type: string
 *                  description: The JWT access token
 *              refreshToken:
 *                  type: string
 *                  description: The JWT refresh token
 *              example:
 *                  accessToken: '123cd123x1xx1'
 *                  refreshToken: '134r2134cr1x3c'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *       summary: registers a new user
 *       tags: [Auth]
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 *       responses:
 *           200:
 *               description: The acess & refresh tokens
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Tokens'
 */
router.post('/login', AuthController.login);

router.get('/refresh', AuthController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *       summary: logout a user
 *       tags: [Auth]
 *       description: need to provide the refresh token in the auth header
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: logout completed successfully
 */

router.post('/google', AuthController.googleSignin);

router.get('/logout', AuthController.logout);

router.get('/getUser/:id', authMiddleware, AuthController.getUserData);

router.put('/update-username', authMiddleware, AuthController.updateProfile);

export default router;
