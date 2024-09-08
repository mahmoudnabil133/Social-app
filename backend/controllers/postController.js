const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


exports.getPosts = async (req, res) =>{
    try{
        const posts = await Post.find().populate('postedBy').populate('comments').populate('likes');
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
        const post = await Post.findById(id).populate('postedBy').populate('comments').populate('likes');
        if (!post) throw new Error('post not found');
        res.status(200).json({
            success: true,
            msg: 'post found',
            data: post
        });

    }catch(err){
        res.status(500).json({
            success: false,
            msg: err.message
        })
    }
};

exports.createPost = async(req, res)=>{
    try{
        const {title, body} = req.body;
        const postedBy = req.user.id;
        const post = await Post.create({title, body, postedBy});
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
        if (post.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        const updatedPost = await Post.findByIdAndUpdate(id, req.body,
            {new: true, runValidators: true});
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
        if (post.postedBy.toString() !== req.user.id) throw new Error('User not authorized');
        await Post.findByIdAndDelete(id);
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

