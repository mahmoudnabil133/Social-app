const Post = require('../models/post');
const redisClient = require('../utils/redis');
require('dotenv').config();
exports.getPosts = async (req, res) =>{
    try{
        const posts = await Post.find().sort({created: -1}).populate('postedBy').populate('comments').populate('likes');
        if (!posts) throw new Error('No posts found');
        res.status(200).json({
            success: true,
            msg: 'posts found',
            length: posts.length,
            data: posts
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};


exports.getOnePost = async (req, res) =>{
    try{
        const { id } = req.params;
        let post = await Post.findById(id);
        if (!post) throw new Error('post not found');
        const postQuery = Post.findById(id);
        if (post.comments.length > 0) {
            postQuery.populate('comments');
        };
        if (post.likes.length > 0) {
            postQuery.populate('likes');
        };
        post = await postQuery;
        res.status(200).json({
            success: true,
            msg: 'posttt found',
            data: post
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.getMyPosts = async(req, res)=>{
    try{
        const value = await redisClient.get(`posts_${req.user.id}`);
        let posts;
        if (value !== null){
            posts = JSON.parse(value);
        } else{
            posts = await Post.find({postedBy: req.user.id}).sort({created: -1}).populate('postedBy').populate('comments').populate('likes');
            await redisClient.set(`posts_${req.user.id}`, JSON.stringify(posts), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'posts found',
            length: posts.length,
            data: posts
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};
exports.getUserPosts = async(req, res)=>{
    try{
        const {userId} = req.params;
        const value = await redisClient.get(`posts_${userId}`);
        let posts;
        if (value !== null){
            posts = JSON.parse(value);
        } else{
            posts = await Post.find({postedBy: userId}).sort({created: -1});
            await redisClient.set(`posts_${userId}`, JSON.stringify(posts), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'posts found',
            length: posts.length,
            data: posts
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }

}
exports.createPost = async(req, res)=>{
    try{
        const {title, body} = req.body;
        const postedBy = req.user.id;
        const photoUrl = req.file ? `uploads/${req.file.filename}` : '';
        const post = await Post.create({title, body, postedBy, photoUrl});
        let cached_posts = await redisClient.get(`posts_${req.user.id}`);
        // update cached posts
        if (cached_posts !== null){
            cached_posts = JSON.parse(cached_posts);
            cached_posts.unshift(post);
            await redisClient.set(`posts_${req.user.id}`, JSON.stringify(cached_posts), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'post created',
            data: post
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.updatePost = async(req, res)=>{
    try{
        const {id} = req.params;
        const post = await Post.findById(id);
        if (!post) throw new Error('post not found');
        if (post.postedBy._id.toString() !== req.user.id) throw new Error('User not authorized');
        const updatedPost = await Post.findByIdAndUpdate(id, req.body,
            {new: true, runValidators: true});
        if (!updatedPost) throw new Error('post not updated');
        let cached_posts = await redisClient.get(`posts_${req.user.id}`);
        if (cached_posts !== null){
            cached_posts = JSON.parse(cached_posts);
            index = cached_posts.findIndex(post => post._id.toString() === id);
            cached_posts[index] = updatedPost;
            await redisClient.set(`posts_${req.user.id}`, JSON.stringify(cached_posts), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'post updated',
            data: updatedPost
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.deletePost = async(req, res)=>{
    try{
        const {id} = req.params;
        const post = await Post.findById(id);
        if (!post) throw new Error('post not found');
        if (post.postedBy._id.toString() !== req.user.id) throw new Error('User not authorized');
        await Post.findByIdAndDelete(id);
        const cached_posts = await redisClient.get(`posts_${req.user.id}`);
        if (cached_posts !== null){
            const posts = JSON.parse(cached_posts);
            const index = posts.findIndex(post => post._id.toString() === id);
            posts.splice(index, 1);
            await redisClient.set(`posts_${req.user.id}`, JSON.stringify(posts), 4 * 24 * 60 * 60);
        }
        res.status(200).json({
            success: true,
            msg: 'post deleted',
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.removeUserPosts = async(req, res, next)=>{
    try{
        userId = req.params.id;
        await Post.deleteMany({postedBy, userId});
        await redisClient.del(`posts_${userId}`);
        next();
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        });
    }
}