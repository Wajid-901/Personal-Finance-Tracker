const dotenv = require('dotenv');
const sendEmail = require('./utils/sendEmail');

dotenv.config();

console.log('Testing Resend Email...');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set ✅' : 'Missing ❌');

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
