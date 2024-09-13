const Post = require('../models/post');
const Comment = require('../models/comment');
const redisClient = require('../utils/redis');
exports.getComments = async(req, res)=>{
    try{
        let query = {};
        if (req.params.postId){
            query = {post: req.params.postId};
        }
        const comments = await Comment.find(query).sort({created: -1});
        if (!comments.length) throw new Error('No comments found');
        res.status(200).json({
            success: true,
            msg: 'comments found',
            length: comments.length,
            data: comments
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};
exports.getOneComment = async(req, res)=>{
    try{
        const {id} = req.params;
        const comment = await Comment.findById(id);
        if (!comment) throw new Error('comment not found');
        res.status(200).json({
            success: true,
            msg: 'comment found',
            data: comment
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};
exports.getMyComments = async(req, res)=>{
    try{
        const {postId} = req.params;
        const userId = req.user.id;
        const comments = await Comment.find({post: postId, postedBy: userId});
        if (!comments.length) throw new Error('No comments found');
        res.status(200).json({
            success: true,
            msg: 'comments found',
            length: comments.length,
            data: comments
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
}
exports.createComment = async(req, res)=>{
    try{
        const {postId} = req.params;
        const {text} = req.body;
        const postedBy = req.user.id;
        let post = await Post.findById(postId);
        if (!post) throw new Error('post not found');
        const comment = {
            text,
            post: postId,
            postedBy
        };
        const newComment = await Comment.create(comment);
        post.comments.push(newComment._id);
        await post.save();
        // post = await Post.findById(postId).populate('comments');
        let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        if (cached_value !== null){
            cached_value = JSON.parse(cached_value);
            let index = cached_value.findIndex((post) => post._id === postId);
            cached_value[index].comments.push(newComment);
            console.log(cached_value[index]);
            await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'comment created',
            data: newComment
        });
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.updateComment = async(req, res)=>{
    try{
        const {id} = req.params;
        // console.log(id);
        console.log(req.user.id);
        const comment = await Comment.findById(id);
        if (!comment) throw new Error('comment not found');
        if (comment.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        let post = await Post.findById(comment.post);
        let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        if (cached_value !== null){
            cached_value = JSON.parse(cached_value);
            let index = cached_value.findIndex((p) => p._id === post._id);
            commentIndex = cached_value[index].comments.findIndex((com) => com._id === id);
            cached_value[index].comments[commentIndex] = updatedComment;
            await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        }
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
        let post = await Post.findById(comment.post);
        commentIndex = post.comments.indexOf(id);
        post.comments.splice(commentIndex, 1);
        await post.save();
        let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        if (cached_value !== null){
            cached_value = JSON.parse(cached_value);
            let index = cached_value.findIndex((p) => p._id === post._id);
            commentIndex = cached_value[index].comments.findIndex((com) => com._id === id);
            cached_value[index].comments.splice(commentIndex, 1);
            await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'comment deleted',
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};