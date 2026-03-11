import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Discount from '../models/Discount.js';
import Newsletter from '../models/Newsletter.js';

export const getAdminStats = async (req, res, next) => {
    try {
        // 1. Total Revenue
        const revenueData = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // 2. Total Sales (Order count)
        const totalSales = await Order.countDocuments({ orderStatus: { $ne: 'Cancelled' } });

        // 3. Total Views (Sum of all product views)
        const viewsData = await Product.aggregate([
            { $group: { _id: null, total: { $sum: { $ifNull: ["$views", 0] } } } }
        ]);
        const totalViews = viewsData.length > 0 ? viewsData[0].total : 0;

        // 4. Stock Alerts (Products with stock < 10)
        const stockAlerts = await Product.countDocuments({ stock: { $lt: 10 } });

        // 6. Active Discounts
        const activeDiscounts = await Discount.countDocuments({ isActive: { $ne: false } });

        // 7. Newsletter Subscribers
        const newsletterSubscribers = await Newsletter.countDocuments();

        // 5. Recent Activity (Latest 5 orders)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('customerInfo totalAmount orderStatus createdAt');

        res.json({
            success: true,
            stats: {
                totalRevenue,
                totalSales,
                totalViews,
                stockAlerts,
                activeDiscounts,
                newsletterSubscribers
            },
            recentOrders
        });
    } catch (error) {
        next(error);
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '7d'
        });

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdminProfile = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findById(req.admin._id);

        if (email) admin.email = email;
        if (password) admin.password = password;

        await admin.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        next(error);
    }
};
