const { Order, Restaurant, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

const generateOrderNumber = () => {
  return `FR${Date.now().toString().slice(-8)}`;
};

// @desc    Place a new order
// @route   POST /api/orders
const placeOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      couponCode,
      specialInstructions,
    } = req.body;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (!restaurant.isOpen) {
      return res.status(400).json({ error: 'Restaurant is currently closed' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant.deliveryFee || 0;
    const tax = subtotal * 0.05; // 5% GST
    let discount = 0;

    // Apply coupon (simplified)
    if (couponCode === 'WELCOME50') discount = Math.min(subtotal * 0.5, 100);
    if (couponCode === 'FREE100') discount = 100;

    const total = Math.max(subtotal + deliveryFee + tax - discount, 0);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      restaurantId,
      items,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      tax: tax.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
      paymentMethod,
      deliveryAddress,
      specialInstructions,
      couponCode,
      estimatedDelivery: new Date(Date.now() + restaurant.deliveryTime * 60 * 1000),
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name', 'logo', 'address'],
      }],
    });

    res.json({
      orders: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name', 'logo', 'address', 'phone'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
      ],
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['out_for_delivery'],
      out_for_delivery: ['delivered'],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${order.status} to ${status}` });
    }

    const updates = { status };
    if (status === 'delivered') {
      updates.deliveredAt = new Date();
      updates.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
    }
    if (status === 'cancelled') {
      updates.cancelReason = req.body.cancelReason;
    }

    await order.update(updates);
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    await order.update({ status: 'cancelled', cancelReason: req.body.reason || 'Cancelled by user' });
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder };
