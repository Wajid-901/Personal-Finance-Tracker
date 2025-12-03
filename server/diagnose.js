const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

dotenv.config();

console.log('='.repeat(60));
console.log('DIAGNOSTIC SCRIPT - Finding Root Causes');
console.log('='.repeat(60));

async function diagnose() {
    // 1. Check Environment Variables
    console.log('\n1. ENVIRONMENT VARIABLES CHECK:');
    console.log('--------------------------------');
    const requiredVars = [
        'MONGO_URI', 'JWT_SECRET', 'SMTP_HOST', 'SMTP_PORT', 
        'SMTP_EMAIL', 'SMTP_PASSWORD', 'FROM_EMAIL', 'FRONTEND_URL'
    ];
    
    let missingVars = [];
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`❌ ${varName}: MISSING`);
            missingVars.push(varName);
        } else {
            const display = varName.includes('PASSWORD') || varName.includes('SECRET') 
                ? '***HIDDEN***' 
                : value;
            console.log(`✅ ${varName}: ${display}`);
        }
    });

    if (process.env.SMTP_SERVICE) {
        console.log(`⚠️  SMTP_SERVICE is set to: ${process.env.SMTP_SERVICE}`);
        console.log('   This might override SMTP_HOST and cause issues!');
    }

    // 2. Test MongoDB Connection
    console.log('\n2. MONGODB CONNECTION TEST:');
    console.log('--------------------------------');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');
        
        // Check if users exist
        const User = require('./models/User');
        const userCount = await User.countDocuments();
        console.log(`✅ Found ${userCount} user(s) in database`);
        
        if (userCount > 0) {
            const users = await User.find({}, 'email name');
            console.log('   Users:');
            users.forEach(u => console.log(`   - ${u.email} (${u.name})`));
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.log('❌ MongoDB Connection Failed:', error.message);
    }

    // 3. Test Email Configuration
    console.log('\n3. EMAIL (SMTP) CONNECTION TEST:');
    console.log('--------------------------------');
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.verify();
        console.log('✅ SMTP Connection Successful');
        console.log(`   Host: ${process.env.SMTP_HOST}`);
        console.log(`   Port: ${process.env.SMTP_PORT}`);
        console.log(`   Secure: ${process.env.SMTP_PORT == 465}`);
    } catch (error) {
        console.log('❌ SMTP Connection Failed:', error.message);
        console.log('   Error Code:', error.code);
    }

    // 4. Summary
    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS COMPLETE');
    console.log('='.repeat(60));
    
    if (missingVars.length > 0) {
        console.log('\n⚠️  ACTION REQUIRED:');
        console.log(`Missing environment variables: ${missingVars.join(', ')}`);
    }
}

diagnose().catch(console.error);
