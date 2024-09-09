const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const friendController = require('../controllers/friendsController');

router.route('/signup')
    .post(authController.signUp);
router.route('/login')
    .post(authController.login);
router.route('/logout')
    .get(authController.logout);
router.route('/forgotPassword')
    .post(authController.forgotPassword);
router.route('/resetPassword/:token')
    .patch(authController.resetPassword);


router.use(authController.protect);
router.route('/me')
    .get(userController.getMe, userController.getOneUser)
    .patch(userController.updateMe)
    .delete(userController.deleteUser);
router.route('/updateMyPassword')
    .patch(authController.updatePassword);


router.route('/friend-requist/:id')
    .post(friendController.requistFriend);
router.route('/accept-friend-requist/:id')
    .post(friendController.acceptRequist);
router.route('/decline-friend-requist/:id')
    .post(friendController.declineRequest);

router.use(authController.restrictTo('admin'));
router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;