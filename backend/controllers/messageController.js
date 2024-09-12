const Message = require('../models/message');
const Queue = require('bull');

exports.sendMessage = async(socket, data)=>{
    try{
        data.from = socket.userId;
        const messageQueue = new Queue('message-queue');
        messageQueue.add({
            data
        });
        console.log('message added to queue');
    }catch(err){
        console.log(err);
    }
};

exports.getMessages = async(req, res)=>{
    try{
        const { userId } = req.params;
        const currentId = req.user.id;
        const messages = await Message.find({
            $or:[
                {from: currentId, to: userId},
                {from: userId, to: currentId}
            ]
        }).sort({timeStamps: 1});
        res.status(200).json({
            success: true,
            msg: 'messages found',
            data: messages
        });

    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}