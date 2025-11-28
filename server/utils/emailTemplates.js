// Professional HTML Email Templates

const getPasswordResetEmail = ({ name, resetUrl, expiresIn = '10 minutes' }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 32px; text-align: center;">
                            <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <span style="font-size: 32px; color: #ffffff;">💰</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Personal Finance Tracker
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                                Hi ${name || 'there'},
                            </p>
                            <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your Personal Finance Tracker account. If you didn't make this request, you can safely ignore this email.
                            </p>
                            <p style="margin: 0 0 32px; color: #64748b; font-size: 16px; line-height: 1.6;">
                                To reset your password, click the button below:
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 32px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                Or copy and paste this URL into your browser:
                            </p>
                            <p style="margin: 8px 0 0; padding: 12px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #0ea5e9; font-size: 14px; word-break: break-all;">
                                ${resetUrl}
                            </p>
                            
                            <!-- Warning Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                                <tr>
                                    <td style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                            ⚠️ <strong>Important:</strong> This link will expire in ${expiresIn} for security reasons.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; text-align: center;">
                                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Personal Finance Tracker. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 12px; text-align: center;">
                                🔒 Secure, private, and cloud-synced
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

module.exports = {
    getPasswordResetEmail
};
