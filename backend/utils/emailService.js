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
    const htmlContent = text.replace(/\n/g, '<br>');
    
    const mailOptions = {
        from: from || "Blog Platform <noreply@blogplatform.com>",
        to: to,
        subject: subject,
        text: text,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            ${htmlContent}
        </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
