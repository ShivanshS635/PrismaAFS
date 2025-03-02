const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const otpStorage = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shivansh832.be22@chitkara.edu.in',
        pass: 'vxrw trsw vrqj bnbu'
    }
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }

    const otp = generateOTP();
    otpStorage[email] = {
        otp: otp,
        timestamp: Date.now()
    };

    const mailOptions = {
        from: 'shivansh832.be22@chitkara.edu.in',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).send({ message: 'Email and OTP are required' });
    }

    const storedOTPData = otpStorage[email];

    if (!storedOTPData || storedOTPData.otp != otp) {
        return res.status(400).send({ message: 'Invalid OTP' });
    }

    if (Date.now() - storedOTPData.timestamp > 300000) {
        delete otpStorage[email];
        return res.status(400).send({ message: 'OTP has expired' });
    }

    delete otpStorage[email];
    res.status(200).send({ message: 'OTP verified successfully' });
});

module.exports = router;