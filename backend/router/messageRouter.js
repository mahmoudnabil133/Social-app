const express = require('express');
const router = express.Router();
messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.route('/:userId')
    .get(messageController.getMessages);

module.exports = router;