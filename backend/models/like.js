const mongoose = require('mongoose');
// const post = require('./post');
const likeSchema = new mongoose.Schema({
    type:{
        enum: ['like', 'dislike', 'love', 'haha'],
        default: 'like'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Like', likeSchema);