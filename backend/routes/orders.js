const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, placeOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrder);
router.patch('/:id/status', authenticate, authorize('restaurant_owner', 'admin'), updateOrderStatus);
router.post('/:id/cancel', authenticate, cancelOrder);

module.exports = router;
