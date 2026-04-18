const express = require('express');
const router = express.Router();
const {
  getRestaurants, getFeaturedRestaurants, getRestaurant,
  createRestaurant, updateRestaurant, getNearbyRestaurants,
} = require('../controllers/restaurantController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', getRestaurants);
router.get('/featured', getFeaturedRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/:id', optionalAuth, getRestaurant);
router.post('/', authenticate, authorize('restaurant_owner', 'admin'), createRestaurant);
router.put('/:id', authenticate, authorize('restaurant_owner', 'admin'), updateRestaurant);

module.exports = router;
