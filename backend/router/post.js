const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentRouter = require('./comment');
const likeRouter = require('./like');

router.use(authController.protect);
router.route('/')
    .get(authController.restrictTo('admin'),postController.getPosts)
    .post(postController.createPost);

router.route('/:id')
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);

router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', likeRouter);
module.exports = router;
