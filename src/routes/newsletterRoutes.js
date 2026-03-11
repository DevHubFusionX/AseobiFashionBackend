import express from 'express';
import { subscribe, getSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';

const router = express.Router();

// Public route
router.post('/subscribe', subscribe);

import { protect } from '../middleware/auth.js';

// Admin routes
router.get('/', protect, getSubscribers);
router.delete('/:id', protect, deleteSubscriber);

export default router;
