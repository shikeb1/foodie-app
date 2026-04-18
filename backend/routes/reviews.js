// Reviews
const express = require('express');
const reviewRouter = express.Router();
const { getRestaurantReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

reviewRouter.get('/restaurant/:restaurantId', getRestaurantReviews);
reviewRouter.post('/', authenticate, createReview);
reviewRouter.delete('/:id', authenticate, deleteReview);

module.exports = reviewRouter;
