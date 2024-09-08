const mongoose =  require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);