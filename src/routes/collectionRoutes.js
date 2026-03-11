import express from 'express';
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection
} from '../controllers/collectionController.js';

const router = express.Router();

import { protect } from '../middleware/auth.js';

router.get('/', getCollections);
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);

export default router;
