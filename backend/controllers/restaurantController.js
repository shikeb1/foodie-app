const { Op } = require('sequelize');
const { Restaurant, MenuItem, Review, User, MenuCategory, Category } = require('../models');
const { sequelize } = require('../config/database');

// @desc    Get all restaurants (with filtering, sorting, pagination)
// @route   GET /api/restaurants
const getRestaurants = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      cuisine,
      rating,
      deliveryTime,
      priceRange,
      isVeg,
      sortBy = 'rating',
      sortOrder = 'DESC',
      lat,
      lng,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { cuisine: { [Op.contains]: [search] } },
        { tags: { [Op.contains]: [search] } },
      ];
    }

    if (cuisine) {
      where.cuisine = { [Op.contains]: [cuisine] };
    }

    if (rating) {
      where.rating = { [Op.gte]: parseFloat(rating) };
    }

    if (deliveryTime) {
      where.deliveryTime = { [Op.lte]: parseInt(deliveryTime) };
    }

    if (priceRange) {
      where.priceRange = priceRange;
    }

    const orderMap = {
      rating: [['rating', sortOrder]],
      deliveryTime: [['deliveryTime', 'ASC']],
      deliveryFee: [['deliveryFee', 'ASC']],
      name: [['name', 'ASC']],
    };

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      order: orderMap[sortBy] || [['rating', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }],
    });

    res.json({
      restaurants: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured restaurants
// @route   GET /api/restaurants/featured
const getFeaturedRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { isFeatured: true, isActive: true },
      order: [['rating', 'DESC']],
      limit: 8,
    });
    res.json({ restaurants });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single restaurant with full menu
// @route   GET /api/restaurants/:id
const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        {
          model: MenuCategory,
          as: 'menuCategories',
          include: [{
            model: MenuItem,
            as: 'items',
            where: { isAvailable: true },
            required: false,
            order: [['sortOrder', 'ASC']],
          }],
          order: [['sortOrder', 'ASC']],
        },
        {
          model: Review,
          as: 'reviews',
          limit: 5,
          order: [['createdAt', 'DESC']],
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
        },
      ],
    });

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc    Create restaurant
// @route   POST /api/restaurants
const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      ownerId: req.user.id,
    });
    res.status(201).json({ message: 'Restaurant created', restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await restaurant.update(req.body);
    res.json({ message: 'Restaurant updated', restaurant });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby restaurants (mock implementation)
// @route   GET /api/restaurants/nearby
const getNearbyRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { isActive: true },
      order: sequelize.random(),
      limit: 6,
    });
    res.json({ restaurants });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRestaurants,
  getFeaturedRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  getNearbyRestaurants,
};
