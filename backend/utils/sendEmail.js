const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

// Step 1: Set up the Nodemailer transporter
const sendEmail = async (recipientEmail, subject, emailBodyHtml) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hodanabil155@gmail.com',
            pass: 'utip ljlx yleq wscy '
        }
    });

    let message = {
        from: 'hodanabil155@gmail.com',
        to: recipientEmail,
        subject: subject, // Dynamic subject
        html: emailBodyHtml, // Dynamic HTML content
        // text: emailBodyText  // Dynamic plain text content
    };

    try {
        let info = await transporter.sendMail(message);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error occurred while sending email: ', error);
        return false;
    }
};

module.exports = sendEmail;