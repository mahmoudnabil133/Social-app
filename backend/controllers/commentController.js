const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Queue = require('bull')
const redisClient = require('../utils/redis');
exports.getComments = async(req, res)=>{
    try{
        let query = {};
        console.log(req.params);
        if (req.params.postId){
            query = {post: req.params.postId};
        }
        const comments = await Comment.find(query).populate('postedBy').sort({created: -1})
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
        const currentUser = await User.findById(req.user.id);
        if (!post) throw new Error('post not found');
        const comment = {
            text,
            post: postId,
            postedBy
        };
        const newComment = await Comment.create(comment);
        post.comments.push(newComment._id);
        let notification = {
            user: post.postedBy,
            postId: post._id,
            message: `${currentUser.userName} commented on your post: ${post.title}`,
        }
        const notificationQueue = new Queue('notification-queue');
        notificationQueue.add({
            notification
        });
        await post.save();
        // post = await Post.findById(postId).populate('comments');
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((post) => post._id === postId);
        //     cached_value[index].comments.push(newComment);
        //     // console.log(cached_value[index]);
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
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
        console.log('post', post);
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((p) => p._id.toString() === post._id.toString());
        //     commentIndex = cached_value[index].comments.findIndex((com) => com._id.toString() === id);
        //     cached_value[index].comments[commentIndex] = updatedComment;
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
        res.status(200).json({
            success: true,
            msg: 'comment updated',
            data: updatedComment
        });
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.deleteComment = async(req, res)=>{
    try{
        const {id} = req.params;
        console.log(id);
        const comment = await Comment.findById(id);
        if (!comment) throw new Error('comment not found');
        if (comment.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        let post = await Post.findById(comment.post);
        console.log('comments', post.comments);
        commentIndex = post.comments.indexOf(comment._id);
        console.log(`index 1`, commentIndex);
        post.comments.splice(commentIndex, 1); 
        await Comment.findByIdAndDelete(id);
        await post.save();
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((p) => p._id.toString() === post._id.toString());
        //     commentIndex = cached_value[index].comments.findIndex((com) => com._id.toString() === id);
        //     console.log(`index 2`, commentIndex);
        //     cached_value[index].comments.splice(commentIndex, 1);
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
        res.status(200).json({
            success: true,
            msg: 'comment deleted',
        });
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};