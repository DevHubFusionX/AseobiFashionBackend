import express from 'express';
import Discount from '../models/Discount.js';

const router = express.Router();

// Validate a discount code
router.post('/validate', async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Discount code is required' });
        }

        const discount = await Discount.findOne({ code: code.toUpperCase(), isActive: true });

        if (!discount) {
            return res.status(404).json({ message: 'Invalid or expired discount code' });
        }

        // Check expiry
        if (discount.expiryDate && new Date() > discount.expiryDate) {
            return res.status(400).json({ message: 'Discount code has expired' });
        }

        // Check usage limit
        if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
            return res.status(400).json({ message: 'Discount code usage limit reached' });
        }

        // Check minimum purchase
        if (cartTotal < discount.minPurchase) {
            return res.status(400).json({
                message: `Minimum purchase of ₦${discount.minPurchase.toLocaleString()} required for this code`
            });
        }

        res.status(200).json({
            code: discount.code,
            type: discount.type,
            value: discount.value,
            message: 'Discount applied successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error validating discount code' });
    }
});

// GET all discounts (Admin)
router.get('/all', async (req, res) => {
    try {
        const discounts = await Discount.find().sort({ createdAt: -1 });
        res.json(discounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching discounts' });
    }
});

// CREATE discount (Admin)
router.post('/', async (req, res) => {
    try {
        const discount = new Discount(req.body);
        await discount.save();
        res.status(201).json(discount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE discount (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await Discount.findByIdAndDelete(req.params.id);
        res.json({ message: 'Discount deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting discount' });
    }
});

export default router;
