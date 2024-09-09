const express = require('express');
const router = express.Router({mergeParams: true});
const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');
router.use(authController.protect);
router.route('/')
    .get(likeController.getPostLikes)
    .post(likeController.createPostLike);

router.route('/:id')
    .get(likeController.getPostLike)
    .patch(likeController.updatePostLike)
    .delete(likeController.deletePostLike);
router.route('/my-like/:postId')
    .get(likeController.getpostUserLike);
module.exports = router;