const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post_controller');

router.get('/', PostController.get);
router.get('/:id', PostController.get);

router.post('/', PostController.post);

router.put('/', PostController.put);

router.delete('/', PostController.deletePost);

module.exports = router;
