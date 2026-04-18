const { Review, Restaurant, User } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
const getRestaurantReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Review.findAndCountAll({
      where: { restaurantId: req.params.restaurantId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });

    res.json({ reviews: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) } });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { restaurantId, rating, title, body, foodRating, deliveryRating, serviceRating, orderId } = req.body;

    const existingReview = await Review.findOne({
      where: { userId: req.user.id, restaurantId },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this restaurant' });
    }

    const review = await Review.create({
      userId: req.user.id,
      restaurantId,
      orderId,
      rating,
      title,
      body,
      foodRating,
      deliveryRating,
      serviceRating,
    });

    // Update restaurant average rating
    const avgResult = await Review.findOne({
      where: { restaurantId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings'],
      ],
      raw: true,
    });

    await Restaurant.update(
      {
        rating: parseFloat(avgResult.avgRating).toFixed(1),
        totalRatings: parseInt(avgResult.totalRatings),
      },
      { where: { id: restaurantId } }
    );

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(201).json({ message: 'Review submitted!', review: fullReview });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRestaurantReviews, createReview, deleteReview };
