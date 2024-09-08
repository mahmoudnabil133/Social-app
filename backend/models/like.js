const mongoose = require('mongoose');
// const post = require('./post');
const likeSchema = new mongoose.Schema({
    type:{
        type: String,
        enum: {
            values: ['Like', 'Dislike', 'Love', 'Haha']
        },
        default: 'Like'
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