const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user')
const redisClient = require('../utils/redis');
const Queue = require('bull')
const Notification = require('../models/notification');

exports.getPostLikes = async(req, res)=>{
    try{
        const {postId} = req.params;
        const likes = await Like.find({post: postId});
        if (!likes.length) throw new Error('No likes found');
        res.status(200).json({
            success: true,
            msg: 'likes found',
            length: likes.length,
            data: likes
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
}
exports.getPostLike = async(req, res)=>{
    try{
        const {postId, id} = req.params;
        const like = await Like.findById(id);
        if (!like) throw new Error('like not found');
        res.status(200).json({
            success: true,
            msg: 'like found',
            data: like
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};
exports.getpostUserLike = async(req, res)=>{
    try{
        const {postId} = req.params;
        const userId = req.user.id;
        const like = await Like.findOne({post: postId, user: userId});
        if (!like) throw new Error('like not found');
        res.status(200).json({
            success: true,
            msg: 'like found',
            data: like
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
}
exports.createPostLike = async(req, res)=>{
    try{
        const {postId} = req.params;
        const {type} = req.body;
        const userId = req.user.id;
        const currentUser = await User.findById(userId)
        let post = await Post.findById(postId).populate('likes');
        if(!post) throw new Error('post not found');
        post.likes.forEach(like=>{
            if (like.user.toString() === userId) throw new Error('you already liked this post');
        });
        const like = await Like.create({type, post: postId, user: userId});
        let notification = {
            user: post.postedBy,
            postId: post._id,
            message: `${currentUser.userName} liked your post: ${post.title}`,
        }
        const notificationQueue = new Queue('notification-queue');
        notificationQueue.add({
            notification
        });
        post.likes.push(like._id);
        await post.save();
        // post = await Post.findById(postId).populate('likes');
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((post) => post._id === postId);
        //     cached_value[index].likes.push(like);
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
        res.status(201).json({
            success: true,
            msg: 'like created',
            data: like
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.updatePostLike = async(req, res)=>{
    try{
        const {id} = req.params;
        const {type} = req.body;
        if (!type) throw new Error('type is required');
        const userId = req.user.id;
        const like = await Like.findById(id);
        if (!like) throw new Error('like not found');
        if (like.user.toString() !== userId) {
            throw new Error('you are not authorized to update this like');
        }
        const updatedLike = await Like.findByIdAndUpdate(id, {type}, {new: true});
        // let post = await Post.findById(like.post);
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((p) => p._id.toString() === post._id.toString());
        //     likeIndex = cached_value[index].likes.findIndex((l) => l._id.toString() === id);
        //     cached_value[index].likes[likeIndex] = updatedLike;
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
        res.status(200).json({
            success: true,
            msg: 'like updated',
            data: updatedLike
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};
exports.deletePostLike = async(req, res)=>{
    try{
        const {id} = req.params;
        const userId = req.user.id;
        let like = await Like.findById(id);
        if (!like) throw new Error('like not found');
        if (like.user.toString() !== userId) {
            throw new Error('you are not authorized to delete this like');
        }
        const post = await Post.findById(like.post);
        let likeIndex = post.likes.indexOf(id);
        post.likes.splice(likeIndex, 1);
        await post.save();
        await Like.findByIdAndDelete(id);
        // let cached_value = await redisClient.get(`posts_${post.postedBy}`);
        // if (cached_value !== null){
        //     cached_value = JSON.parse(cached_value);
        //     let index = cached_value.findIndex((p) => p._id.toString() === post._id.toString());
        //     likeIndex = cached_value[index].likes.findIndex((l) => l._id.toString() === id.toString());
        //     cached_value[index].likes.splice(likeIndex, 1);
        //     await redisClient.set(`posts_${post.postedBy}`, JSON.stringify(cached_value), 4 * 24 * 60 * 60);
        // }
        res.status(200).json({
            success: true,
            msg: 'like deleted',
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};