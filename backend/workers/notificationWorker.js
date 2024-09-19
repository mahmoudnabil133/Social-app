const Queue = require('bull');
const Notification = require('../models/notification');
const {getIo} = require('../utils/io');

const processNotification = async()=>{
    const notificationQueue = new Queue('notification-queue')
    notificationQueue.process(async(job)=>{
        const {notification} = job.data;
        let newNot = await Notification.create({
            ...notification
        });
        const io = getIo();
        io.to(notification.user).emit('recieve-notification', notification);
        
        notificationQueue.on('completed', (job, result)=>{
            console.log(`job ${job.id} completed`);
        });
        notificationQueue.on('failed', ()=>{
            console.log(`job ${job.id} failed: ${err.message}`);
        })
    })

};
module.exports = processNotification;