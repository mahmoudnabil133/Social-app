const mongoose = require('mongoose');

const notificatioScema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    message:{
        type: String,
        required: true
    },
    read:{
        type: Boolean,
        default: false
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Notification', notificatioScema);