const User = require('../models/user');

//.id & :id param is str
//._id & [ mongoose.schema.types.objectId] is object
exports.requistFriend = async(req, res)=>{
    try{
        const {id} = req.params;
        const currentUser = req.user;
        const requistedUser = await User.findById(id);
        if (!requistedUser) throw new Error('User not found');
        if (currentUser.id === id) throw new Error('you cannet add yourself');
        if (currentUser.friends.includes(requistedUser._id)) throw new Error('you are already freinds');
        requistedUser.freindRequists.push(currentUser._id);
        await requistedUser.save();
        res.status(200).json({
            status: 'success',
            message: 'request sent'
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.acceptRequist = async(req, res)=>{
    try{
        const {id} = req.params;
        const currentUser = req.user;
        const requistingUser = await User.findById(id);
        if (!requistingUser) throw new Error('User not found');
        if (!currentUser.friendRequists.includes(requistingUser._id)) throw new Error('no requists from this user');
        currentUser.friends.push(requistingUser._id);
        requistingUser.friends.push(currentUser._id);
        curUserIndex = currentUser.freindRequests.indexOf(requistingUser._id);
        currentUser.friendRequists.splice(currentUser, 1);
        await currentUser.save();
        await requistingUser.save();
        res.status(200).json({
            status: 'success',
            message: 'request accepted'
        });

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.declineRequest = async(req, res)=>{
    try{
        const {id} = req.params;
        const currentUser = req.user;
        const requistingUser = await User.findById(id);
        if (!requistingUser) throw new Error('User not found');
        if (!currentUser.friendRequists.includes(requistingUser._id)) throw new Error('no requists from this user');
        curUserIndex = currentUser.freindRequests.indexOf(requistingUser._id);
        currentUser.friendRequists.splice(currentUser, 1);
        await currentUser.save();
        res.status(200).json({
            status: 'success',
            message: 'request declined'
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};
