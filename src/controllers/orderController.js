import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'All') {
            query.orderStatus = status;
        }
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('items.product', 'name image colors')
            .lean();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest)
export const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { customerInfo, items, shippingAddress, totalAmount, deliveryMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Validate shipping address if delivery is selected
        if (deliveryMethod === 'Delivery') {
            if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
                return res.status(400).json({ message: 'Shipping address is required for delivery' });
            }
        }

        // 1. Validate stock for all items
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
            }
        }

        // 2. Create the order
        const order = new Order({
            customerInfo,
            items,
            shippingAddress: deliveryMethod === 'Pickup' ? undefined : shippingAddress,
            totalAmount,
            deliveryMethod
        });

        const createdOrder = await order.save();

        // 3. Update stock levels and salesCount (Atomic)
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity, salesCount: item.quantity } },
                { new: true, runValidators: true }
            );
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product', 'name image');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin (Simulated for now)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            // Logic for inventory restoration if cancelled
            if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
                }
            }

            order.orderStatus = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
