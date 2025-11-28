const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ dateIso: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, amountCents, categoryId, note, dateIso } = req.body;

        if (!type || !amountCents || !dateIso) {
            return res.status(400).json({ message: 'Please provide type, amount, and date' });
        }

        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            amountCents,
            categoryId,
            note,
            dateIso
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction' });
    }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Verify user owns this transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { type, amountCents, categoryId, note, dateIso } = req.body;

        transaction.type = type !== undefined ? type : transaction.type;
        transaction.amountCents = amountCents !== undefined ? amountCents : transaction.amountCents;
        transaction.categoryId = categoryId !== undefined ? categoryId : transaction.categoryId;
        transaction.note = note !== undefined ? note : transaction.note;
        transaction.dateIso = dateIso !== undefined ? dateIso : transaction.dateIso;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction' });
    }
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Verify user owns this transaction
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await transaction.deleteOne();
        res.json({ message: 'Transaction removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction' });
    }
});

module.exports = router;
