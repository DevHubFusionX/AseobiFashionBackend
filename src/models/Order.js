import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
            color: { type: String },
            image: { type: String }
        }
    ],
    deliveryMethod: {
        type: String,
        enum: ['Delivery', 'Pickup'],
        default: 'Delivery'
    },
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String }
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    totalAmount: { type: Number, required: true },
    trackingNumber: { type: String },
    paymentReference: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
