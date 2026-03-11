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

// Admin / Write Operations
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
