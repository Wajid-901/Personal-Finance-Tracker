const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter using Brevo SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || process.env.SMTP_EMAIL, // Support both variable names
            pass: process.env.EMAIL_PASS, // Your Brevo SMTP Key
        },
        family: 4, // Force IPv4 to avoid IPv6 connection issues
    });

    // Email options
    const mailOptions = {
        from: `${process.env.FROM_NAME || 'Personal Finance Tracker'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html || options.message,
        text: options.message || "Please enable HTML to view this email"
    };

    try {
        console.log('Sending email to:', options.email);
        console.log('Subject:', options.subject);
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully! Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};

module.exports = sendEmail;
