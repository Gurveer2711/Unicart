import express from 'express';
import { createCheckoutSession, processOrder } from '../controllers/checkoutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All checkout routes are protected (require authentication)
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/process-order', protect, processOrder);

export default router; 