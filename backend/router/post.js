const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentRouter = require('./comment');
const likeRouter = require('./like');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+file.originalname);
    }
});
const upload = multer({storage: storage});

router.use(authController.protect);
router.route('/')
    .get(authController.restrictTo('admin'),postController.getPosts)
    .post(upload.single('photo'), postController.createPost);

router.route('/my-posts')
    .get(postController.getMyPosts);

router.route('/:id')
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);

router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', likeRouter);
module.exports = router;
