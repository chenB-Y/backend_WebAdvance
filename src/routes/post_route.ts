import express from 'express';
const router = express.Router();
import PostController from '../controllers/post_controller';
import { authMiddleware } from '../controllers/auth_controller';
router.get('/', PostController.get.bind(PostController));
router.get('/:id', PostController.get.bind(PostController));

router.post('/', authMiddleware, PostController.post.bind(PostController));

router.put('/', PostController.put.bind(PostController));

router.delete('/', PostController.delete.bind(PostController));

export default router;
