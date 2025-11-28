const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            createdAt: user.createdAt
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
            createdAt: user.createdAt
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://localhost:5173/resetpassword/${resetToken}`;

    const { getPasswordResetEmail } = require('../utils/emailTemplates');
    const html = getPasswordResetEmail({
        name: user.name,
        resetUrl,
        expiresIn: '10 minutes'
    });

    console.log('--------------------------------------------------');
    console.log('DEV MODE: Password Reset URL:');
    console.log(resetUrl);
    console.log('--------------------------------------------------');

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Your Password - Personal Finance Tracker',
            html
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.error('Email send error:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({ message: 'Email could not be sent. Check server console for error details.' });
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password updated success',
        token: generateToken(user._id),
        _id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    });
});

module.exports = router;
