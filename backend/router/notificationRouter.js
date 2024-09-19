const express = require('express');
const router = express.Router({mergeParams: true});
const authController = require('../controllers/authController');
const notificationController = require('../controllers/notificatioController');

router.use(authController.protect);
router.route('/')
    .get(notificationController.getMyNotifications)

router.route('/:id')
    .patch(notificationController.readNotification)
    .delete(notificationController.deleteNotification)

module.exports = router;