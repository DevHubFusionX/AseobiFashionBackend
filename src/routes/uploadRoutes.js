import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';

const router = express.Router();

// Middleware to set longer timeout for upload endpoints
const uploadTimeout = (req, res, next) => {
    req.setTimeout(120000); // 120 seconds for uploads
    next();
};

router.post('/', uploadTimeout, upload.single('image'), uploadImage);
router.post('/multiple', uploadTimeout, upload.array('images', 10), uploadMultipleImages);

export default router;
