const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require('../models');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByPk(orderId);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(order.total) * 100), // in paise
      currency: 'inr',
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    });

    await order.update({ stripePaymentIntentId: paymentIntent.id });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Order.update(
      { paymentStatus: 'paid', status: 'confirmed' },
      { where: { stripePaymentIntentId: paymentIntent.id } }
    );
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Order.update(
      { paymentStatus: 'failed' },
      { where: { stripePaymentIntentId: paymentIntent.id } }
    );
  }

  res.json({ received: true });
};

// @desc    Apply coupon
// @route   POST /api/payments/apply-coupon
const applyCoupon = async (req, res) => {
  const { code, orderTotal } = req.body;

  const coupons = {
    WELCOME50: { type: 'percentage', value: 50, max: 100, min: 0 },
    SAVE20: { type: 'percentage', value: 20, max: 200, min: 100 },
    FLAT100: { type: 'fixed', value: 100, min: 300 },
    FREEDEL: { type: 'delivery', value: 100, min: 200 },
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return res.status(400).json({ error: 'Invalid coupon code' });

  if (orderTotal < coupon.min) {
    return res.status(400).json({ error: `Minimum order ₹${coupon.min} required for this coupon` });
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.min((orderTotal * coupon.value) / 100, coupon.max);
  } else if (coupon.type === 'fixed' || coupon.type === 'delivery') {
    discount = coupon.value;
  }

  res.json({
    valid: true,
    discount: discount.toFixed(2),
    message: `Coupon applied! You save ₹${discount.toFixed(0)}`,
  });
};

module.exports = { createPaymentIntent, stripeWebhook, applyCoupon };
