const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

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

router.use(authController.restrictTo('admin'));
router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;