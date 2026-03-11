import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  colors: [{ type: String }],
  colorImages: [{
    color: { type: String },
    image: { type: String }
  }],
  views: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
