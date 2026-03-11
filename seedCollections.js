import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collection from './src/models/Collection.js';

dotenv.config();

const collections = [
  { title: 'The Bridal Suite', description: 'Ethereal silks and delicate laces crafted for unforgettable moments', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', category: 'Silk' },
  { title: 'Autumn Cashmere', description: 'Ultra-soft, ethically sourced cashmere blends in rich, earthy tones', image: 'https://images.unsplash.com/photo-1610419131604-db5b5ca49a1d?w=800', category: 'Wool' },
  { title: 'Midnight Velvet', description: 'Plush, dense velvets with an obsidian sheen for dramatic eveningwear', image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800', category: 'Velvet' },
  { title: 'Bespoke Suiting', description: 'Structured wools and breathable linens for master tailoring', image: 'https://images.unsplash.com/photo-1558487661-9d4f0192cf64?w=800', category: 'Wool' }
];

const seedCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Collection.deleteMany({});
    await Collection.insertMany(collections);
    console.log('Collections seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedCollections();
