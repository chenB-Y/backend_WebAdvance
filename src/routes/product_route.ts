import express from 'express';
const router = express.Router();
import ProductController from '../controllers/product_controller';
import { authMiddleware } from '../controllers/auth_controller';

//router.get('/', authMiddleware, ProductController.get.bind(ProductController));
router.get('/', authMiddleware, ProductController.get.bind(ProductController));
router.get(
  '/:id',
  authMiddleware,
  ProductController.get.bind(ProductController)
);

router.post(
  '/',
  authMiddleware,
  ProductController.post.bind(ProductController)
);

router.put(
  '/update-product/:id',
  authMiddleware,
  ProductController.put.bind(ProductController)
);

router.delete(
  '/',
  authMiddleware,
  ProductController.delete.bind(ProductController)
);

export default router;
