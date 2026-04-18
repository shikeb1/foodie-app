const { MenuItem, MenuCategory, Restaurant } = require('../models');

// @desc    Get full menu for restaurant
// @route   GET /api/menu/restaurant/:restaurantId
const getRestaurantMenu = async (req, res, next) => {
  try {
    const categories = await MenuCategory.findAll({
      where: { restaurantId: req.params.restaurantId },
      order: [['sortOrder', 'ASC']],
      include: [{
        model: MenuItem,
        as: 'items',
        where: { isAvailable: true },
        required: false,
        order: [['sortOrder', 'ASC']],
      }],
    });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Add menu item
// @route   POST /api/menu/item
const addMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ where: { id: req.body.restaurantId, ownerId: req.user.id } });
    if (!restaurant && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const item = await MenuItem.create(req.body);
    res.status(201).json({ message: 'Menu item added', item });
  } catch (err) {
    next(err);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/item/:id
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Restaurant, required: true }],
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.update(req.body);
    res.json({ message: 'Item updated', item });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/item/:id
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add menu category
// @route   POST /api/menu/category
const addMenuCategory = async (req, res, next) => {
  try {
    const category = await MenuCategory.create(req.body);
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRestaurantMenu, addMenuItem, updateMenuItem, deleteMenuItem, addMenuCategory };
