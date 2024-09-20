const Queue = require('bull');
const userQueue = new Queue('user-queue');
const sendEmail = require('../utils/sendEmail');

const processSendingEmail = async()=>{
    userQueue.process(async(job)=>{
        const {email, subject, emailBodyHtml} = job.data;
        await sendEmail(email, subject, emailBodyHtml);
        // userQueue.on('completed', (job, result)=>{
        //     console.log(`job :${job.id} completed`);
        // });
        // userQueue.on('failed', (job, err)=>{
        //     console.log(`job ${job.id}failed: ${err.message}`);
        // });
    })
};

module.exports = processSendingEmail;