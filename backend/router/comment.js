const express = require('express');
const router = express.Router({mergeParams: true});
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
router.use(authController.protect);
router.route('/')
    .get(commentController.getComments)
    .post(commentController.createComment);
router.route('/:id')
    .get(commentController.getOneComment)
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;