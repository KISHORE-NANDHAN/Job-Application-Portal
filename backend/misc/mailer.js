const nodemailer = require('nodemailer');

// Configure your email service (this is using Gmail SMTP as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ash.naruto.uzumaki@gmail.com', // replace with your email
        pass: 'iovu dyqm ghjk iohu',   // replace with your email password (or app-specific password)
    },
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: 'ash.naruto.uzumaki@gmail.com', // sender address
        to,                           // recipient address
        subject,                      // Subject line
        text,                         // plain text body
        html,                         // HTML body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;
