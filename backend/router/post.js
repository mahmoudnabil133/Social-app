const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentRouter = require('./comment');
const likeRouter = require('./like');
const upload = require('../middlewares/uploadPhoto');

router.use(authController.protect);
router.route('/')
    .get(postController.getPosts)
    .post(upload.single('photo'), postController.createPost);

router.route('/my-posts')
    .get(postController.getMyPosts);

router.route('/:id')
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);
router.route('/user/:userId')
    .get(postController.getUserPosts);

router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', likeRouter);
module.exports = router;
