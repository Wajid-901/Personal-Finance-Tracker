const dotenv = require('dotenv');
const sendEmail = require('./utils/sendEmail');

dotenv.config();

console.log('Testing Email Service (Brevo)...');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'Default: smtp-relay.brevo.com');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Default: 587');
console.log('EMAIL_USER:', (process.env.EMAIL_USER || process.env.SMTP_EMAIL) ? 'Set ✅' : 'Missing ❌');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✅' : 'Missing ❌');

sendEmail({
    email: 'abdulwajid845433@gmail.com', // Your verified email
    subject: 'Test Email from Resend',
    html: '<h1>Success!</h1><p>If you see this, Resend is working correctly!</p>'
}).then(() => {
    console.log('✅ Test email sent successfully!');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Test email failed:', error);
    process.exit(1);
});
