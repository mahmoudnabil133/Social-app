const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});
PostSchema.index({postedBy: 1});
PostSchema.index({created: -1});
// PostSchema.pre(/^find/, function(next){
//     this.populate('postedBy').populate('comments').populate('likes');
//     next();
// })

module.exports = mongoose.model('Post', PostSchema);