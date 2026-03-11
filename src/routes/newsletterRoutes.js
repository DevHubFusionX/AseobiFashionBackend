import express from 'express';
import { subscribe, getSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';

const router = express.Router();

// Public route
router.post('/subscribe', subscribe);

// Admin routes (In a real app, add auth middleware here)
router.get('/', getSubscribers);
router.delete('/:id', deleteSubscriber);

export default router;
