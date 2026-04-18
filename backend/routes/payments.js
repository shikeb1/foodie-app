const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook, applyCoupon } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/apply-coupon', authenticate, applyCoupon);

module.exports = router;
