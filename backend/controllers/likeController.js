const Post = require('../models/post');
const Like = require('../models/like');

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
exports.createPostLike = async(req, res)=>{
    try{
        const {postId} = req.params;
        const {type} = req.body;
        const userId = req.user.id;
        let post = await Post.findById(postId).populate('likes');
        if(!post) throw new Error('post not found');
        post.likes.forEach(like=>{
            if (like.user.toString() === userId) throw new Error('you already liked this post');
        });
        const like = await Like.create({type, post: postId, user: userId});
        post.likes.push(like._id);
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
        let like = await Like.findById(id);
        if (!like) throw new Error('like not found');
        if (like.user.toString() !== userId) {
            throw new Error('you are not authorized to update this like');
        }
        like.type = type;
        await like.save();
        res.status(200).json({
            success: true,
            msg: 'like updated',
            data: like
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
        await like.remove();
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