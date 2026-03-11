import express from 'express';
import { getAdminStats, adminLogin, updateAdminProfile } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', protect, getAdminStats);
router.put('/profile', protect, updateAdminProfile);

export default router;
