const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        // If SMTP_SERVICE is defined (e.g. 'gmail'), use it. Otherwise use host/port.
        ...(process.env.SMTP_SERVICE ? { service: process.env.SMTP_SERVICE } : {}),
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Expense Tracker'} <${process.env.FROM_EMAIL || 'noreply@expensetracker.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
