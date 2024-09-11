const Message = require('../models/message');


exports.sendMessage = async(socket, data)=>{
    try{
        const message = await Message.create({
            from: socket.userId,
            to: data.recievedId,
            message: data.message
        });
        console.log(message)
        socket.to(data.recievedId).emit('recieve-message', data)

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