const Queue = require('bull');
const {getIo} = require('./utils/io');
const Message = require('./models/message');

const processMessage = async()=>{
    const messageQueue = new Queue('message-queue');
    // console.log('worker is running');
    messageQueue.process(async(job)=>{
        const {data} = job.data;
        const message = await Message.create({
            from: data.from,
            to: data.recievedId,
            message: data.message,
            timeStamps: data.timeStamps
        });
        const io = getIo();
        io.to(data.recievedId).emit('recieve-message', data);
    });
    messageQueue.on('completed', (job, result)=>{
        console.log(`job :${job.id} completed`);
    });
    messageQueue.on('failed', (job, err)=>{
        console.log(`job ${job.id}failed: ${err.message}`);
    });

};
module.exports = processMessage;