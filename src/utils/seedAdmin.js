import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        // Clear existing admins
        await Admin.deleteMany({});

        const adminData = {
            email: 'Fanyanwu83@gmail.com',
            password: 'admn123'
        };

        const admin = new Admin(adminData);
        await admin.save();

        console.log('✅ Admin user seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
