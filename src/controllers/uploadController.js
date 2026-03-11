import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import limit from 'p-limit';

// Limit concurrent uploads to prevent API throttling
const uploadLimit = limit(3);

// Cloudinary upload options with optimizations
const getUploadOptions = () => ({
    folder: 'favour-products',
    resource_type: 'auto',
    quality: 'auto',
    fetch_format: 'auto',
    eager: [
        { width: 300, height: 300, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        { width: 800, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
    ],
    cache_control: 'max-age=31536000, public'
});

// Upload file using stream instead of base64
const uploadToCloudinary = (buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const stream = Readable.from(buffer);
        
        const uploadStream = cloudinary.uploader.upload_stream(
            getUploadOptions(),
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        stream.pipe(uploadStream);
    });
};

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

        res.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            eager: result.eager || []
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
};

export const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        // Use concurrency limit to prevent overwhelming Cloudinary API
        const uploadPromises = req.files.map(file =>
            uploadLimit(() => uploadToCloudinary(file.buffer, file.mimetype))
        );

        const images = await Promise.all(uploadPromises);

        res.json({
            success: true,
            images: images.map(result => ({
                url: result.secure_url,
                publicId: result.public_id,
                eager: result.eager || []
            }))
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
};
