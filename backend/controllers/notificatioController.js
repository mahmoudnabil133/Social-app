const Notification = require('../models/notification');

exports.getMyNotifications = async(req, res)=>{
    try{
        const userId = req.user.id;
        const notifications = await Notification.find({user: userId});
        if (notifications.length === 0) throw new Error('No notifications found');
        res.status(200).json({
            success: true,
            msg: 'notifications found',
            length: notifications.length,
            data: notifications
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.deleteNotification = async(req, res)=>{
    try{
        const {id} = req.params;
        const not = await Notification.findById(id);
        if (!not) throw new Error('notification not found');
        if (req.user.id !== not.user.toString()) throw new Error('you are not authorized to del this not');
        await Notification.findByIdAndDelete(id);
        res.status(200).json({
          success: true,
          msg: 'notification deleted'
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
};

exports.readNotification = async(req, res)=>{
    try{
        const {id} = req.params;
        const not = await Notification.findById(id);
        if (!not) throw new Error('notification not found');
        if (req.user.id !== not.user.toString()) throw new Error('you are not authorized to read this not');
        await Notification.findByIdAndUpdate(id, {read: true});
        res.status(200).json({
            success: true,
            msg: 'notification read'
        });
    }catch(err){
        res.status(400).json({
            success: false,
            msg: err.message
        })
    }
}