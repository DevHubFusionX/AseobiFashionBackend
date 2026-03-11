import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null }, // total times this code can be used
    usageCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Discount', discountSchema);
