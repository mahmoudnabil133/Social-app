const User = require('../models/user');
const redisClient = require('../utils/redis');
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
        if (requistedUser.friendRequists.includes(currentUser._id)) throw new Error('request already sent');
        requistedUser.friendRequists.push(currentUser._id);
        await requistedUser.save({validateBeforeSave: false});
        res.status(200).json({
            status: 'success',
            message: 'request sent'
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
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
        curUserIndex = currentUser.friendRequists.indexOf(requistingUser._id);
        currentUser.friendRequists.splice(curUserIndex, 1);
        await currentUser.save({validateBeforeSave: false});
        await requistingUser.save({validateBeforeSave: false});
        res.status(200).json({
            status: 'success',
            message: 'request accepted'
        });

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
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
        curUserIndex = currentUser.friendRequists.indexOf(requistingUser._id);
        currentUser.friendRequists.splice(currentUser, 1);
        await currentUser.save({validateBeforeSave: false});
        res.status(200).json({
            status: 'success',
            message: 'request declined'
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getRecommendedFriends = async (req, res) => {
    try {
      const currentUserId = req.user.id;
  
      // Find the current user and populate friends and friend requests
      const user = await User.findById(currentUserId)
  
      // Get only the friends' and friend requests' IDs
      const friendIds = user.friends
      const requestIds = user.friendRequists
  
      // Find all users
      const allUsers = await User.find();
  
      // Filter users: exclude friends, friend requests, and the current user
      const recommendedFriends = allUsers.filter(u => 
        !friendIds.includes(u._id) && 
        !requestIds.includes(u._id) && 
        u.id !== currentUserId
      );
      
      // Return recommended friends
      res.status(200).json({
        status: 'success',
        data: recommendedFriends
      });
      
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  };
  