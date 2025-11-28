const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const testEmail = async () => {
    console.log('Testing SMTP Connection...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_EMAIL);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Successful!');
        
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: process.env.SMTP_EMAIL, // Send to self
            subject: 'Test Email',
            text: 'If you see this, email sending is working!'
        });
        console.log('✅ Test Email Sent:', info.messageId);
    } catch (error) {
        console.error('❌ SMTP Connection Failed:');
        console.error(error);
    }
};

testEmail();
