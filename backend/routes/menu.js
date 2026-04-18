// Menu routes
const express = require('express');
const router = express.Router();
const { getRestaurantMenu, addMenuItem, updateMenuItem, deleteMenuItem, addMenuCategory } = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', getRestaurantMenu);
router.post('/item', authenticate, authorize('restaurant_owner', 'admin'), addMenuItem);
router.put('/item/:id', authenticate, authorize('restaurant_owner', 'admin'), updateMenuItem);
router.delete('/item/:id', authenticate, authorize('restaurant_owner', 'admin'), deleteMenuItem);
router.post('/category', authenticate, authorize('restaurant_owner', 'admin'), addMenuCategory);

module.exports = router;
