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
