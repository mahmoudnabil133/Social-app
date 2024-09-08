const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        text: String,
        postedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);