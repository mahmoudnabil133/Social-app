const Post = require('../models/Post');
const Comment = require('../models/Comment');
exports.addComment = async(req, res)=>{
    try{
        const {id} = req.params;
        const {text} = req.body;
        const postedBy = req.user.id;
        const post = await Post.findById(id);
        if (!post) throw new Error('post not found');
        const comment = {
            text,
            post: id,
            postedBy
        };
        const newComment = await Comment.create(comment);
        post.comments.push(newComment._id);
        res.status(200).json({
            success: true,
            msg: 'comment created',
            data: newComment
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.updateComment = async(req, res)=>{
    try{
        const {id} = req.params;
        const comment = await Comment.findById(id);
        if (!comment) throw new Error('comment not found');
        if (comment.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            success: true,
            msg: 'comment updated',
            data: updatedComment
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.deleteComment = async(req, res)=>{
    try{
        const {id} = req.params;
        const comment = await Comment.findById(id);
        if (!comment) throw new Error('comment not found');
        if (comment.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        const post = await Post.findById(comment.post);
        commentIndex = post.comments.indexOf(id);
        post.comments.splice(commentIndex, 1);
        await post.save();
        await Comment.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            msg: 'comment updated',
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};