const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all categories for logged-in user
// @route   GET /api/categories
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, color, icon } = req.body;

        if (!name || !color || !icon) {
            return res.status(400).json({ message: 'Please provide name, color, and icon' });
        }

        const category = await Category.create({
            user: req.user._id,
            name,
            color,
            icon
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Verify user owns this category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, color, icon } = req.body;

        category.name = name !== undefined ? name : category.name;
        category.color = color !== undefined ? color : category.color;
        category.icon = icon !== undefined ? icon : category.icon;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Verify user owns this category
        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

module.exports = router;
