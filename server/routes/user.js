const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed and if it already exists
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// @desc    Change user password
// @route   PUT /api/user/password
// @access  Private
router.put('/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all user's transactions and categories
        await Transaction.deleteMany({ user: req.user._id });
        await Category.deleteMany({ user: req.user._id });

        // Delete user
        await user.deleteOne();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Error deleting account' });
    }
});

// @desc    Upload/Update user avatar
// @route   PUT /api/user/avatar
// @access  Private
router.put('/avatar', protect, async (req, res) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({ message: 'No avatar data provided' });
        }

        // Validate base64 image
        if (!avatar.startsWith('data:image/')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = avatar;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ message: 'Error uploading avatar' });
    }
});

module.exports = router;
