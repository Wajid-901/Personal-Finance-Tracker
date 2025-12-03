const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const sendEmail = async (options) => {
    const mailersend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });

    if (!process.env.MAILERSEND_API_KEY) {
        console.error('MAILERSEND_API_KEY is not configured in environment variables');
        throw new Error('Email service is not configured. Please contact support.');
    }

    try {
        const sentFrom = new Sender(process.env.FROM_EMAIL || "info@trial-3yxj6lj9015ldo2r.mlsender.net", process.env.FROM_NAME || "Personal Finance Tracker");
        const recipients = [
            new Recipient(options.email, options.name || "User")
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(options.subject)
            .setHtml(options.html || options.message)
            .setText(options.message || "Please enable HTML to view this email");

        console.log('Sending email to:', options.email);
        console.log('Subject:', options.subject);

        const response = await mailersend.email.send(emailParams);

        console.log('✅ Email sent successfully! ID:', response.headers?.['x-message-id'] || 'sent');
        return response;
    } catch (error) {
        console.error('❌ Failed to send email:', error.body || error.message);
        // Throwing error to be caught by the dev mode bypass in auth.js
        throw error;
    }
};

module.exports = sendEmail;
