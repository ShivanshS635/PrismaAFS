const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); 
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: "shivansh3375@gmail.com",
      pass: process.env.APP_PASS,
    },
  });

const sendEmail = async ({from, to, subject, text }) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
