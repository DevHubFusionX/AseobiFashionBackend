import express from 'express';
import {
    getProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getFilterOptions,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { trackView } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/filters', getFilterOptions);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/:id/view', trackView);

import { protect } from '../middleware/auth.js';

// Admin / Write Operations
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
