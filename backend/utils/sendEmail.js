const nodemailer = require('nodemailer');
const sendEmail = async options =>{
    // 1) create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PROT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define options
    mailOptions = {
        from: 'mahmoud nabil <hoda@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) send email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;