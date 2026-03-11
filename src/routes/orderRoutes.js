import express from 'express';
import { body } from 'express-validator';
import { limiter } from '../middleware/rateLimiter.js';
import {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

const orderValidation = [
    body('customerInfo.email').isEmail().withMessage('Please provide a valid email'),
    body('customerInfo.phone').notEmpty().withMessage('Phone number is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('deliveryMethod').isIn(['Delivery', 'Pickup']).withMessage('Invalid delivery method'),
];

router.get('/', getAllOrders);
router.post('/', limiter, orderValidation, createOrder);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
