import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

console.log('Testing Cloudinary Configuration...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test connection
console.log('\n2. Testing Cloudinary Connection...');
cloudinary.api.ping()
    .then(() => {
        console.log('   ✓ Cloudinary connection successful!');
        console.log('\n✓ All checks passed. Image upload should work.');
    })
    .catch((error) => {
        console.log('   ✗ Cloudinary connection failed:', error.message);
        console.log('\n✗ Please check your Cloudinary credentials.');
    });
