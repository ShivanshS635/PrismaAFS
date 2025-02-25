const nodemailer = require('nodemailer');

// Create a transporter object with your email service credentials
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: "shivansh832.be22@chitkara.edu.in",
      pass: "kjxz fqrv xwuj dbfr",
    },
  });

// Function to send email
const sendEmail = async ({ to, subject, text }) => {
    const mailOptions = {
        from: 'shivansh832.be22@chitkara.edu.in', // Sender address
        to: to, // List of receivers
        subject: subject, // Subject line
        text: text // Plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail };
