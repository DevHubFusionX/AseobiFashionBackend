import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;

        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already subscribed' });
        }

        await Newsletter.create({ email });
        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        next(error);
    }
};

export const getSubscribers = async (req, res, next) => {
    try {
        const subscribers = await Newsletter.find().sort({ createdAt: -1 });
        res.json({ success: true, data: subscribers });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscriber = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Newsletter.findByIdAndDelete(id);
        res.json({ success: true, message: 'Subscriber removed' });
    } catch (error) {
        next(error);
    }
};
