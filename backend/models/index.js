const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ─── User Model ─────────────────────────────────────────────────────────────
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING(15) },
  avatar: { type: DataTypes.TEXT },
  role: { type: DataTypes.ENUM('customer', 'restaurant_owner', 'admin'), defaultValue: 'customer' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  addresses: { type: DataTypes.JSONB, defaultValue: [] },
}, { tableName: 'users', underscored: true });

// ─── Category Model ─────────────────────────────────────────────────────────
const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  icon: { type: DataTypes.STRING },
  image: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'categories', underscored: true });

// ─── Restaurant Model ───────────────────────────────────────────────────────
const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  ownerId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  cuisine: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  address: { type: DataTypes.JSONB, allowNull: false },
  phone: { type: DataTypes.STRING(15) },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  logo: { type: DataTypes.TEXT },
  coverImage: { type: DataTypes.TEXT },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  totalRatings: { type: DataTypes.INTEGER, defaultValue: 0 },
  deliveryTime: { type: DataTypes.INTEGER, defaultValue: 30, comment: 'Minutes' },
  deliveryFee: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  minOrder: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  isOpen: { type: DataTypes.BOOLEAN, defaultValue: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  openingHours: { type: DataTypes.JSONB, defaultValue: {} },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  offerBadge: { type: DataTypes.STRING },
  priceRange: { type: DataTypes.ENUM('budget', 'moderate', 'expensive'), defaultValue: 'moderate' },
}, { tableName: 'restaurants', underscored: true });

// ─── MenuItem Model ─────────────────────────────────────────────────────────
const MenuItem = sequelize.define('MenuItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  categoryId: { type: DataTypes.UUID },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  originalPrice: { type: DataTypes.DECIMAL(8, 2) },
  image: { type: DataTypes.TEXT },
  isVeg: { type: DataTypes.BOOLEAN, defaultValue: true },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  isBestseller: { type: DataTypes.BOOLEAN, defaultValue: false },
  spiceLevel: { type: DataTypes.ENUM('mild', 'medium', 'hot', 'extra_hot'), defaultValue: 'mild' },
  allergens: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  nutritionInfo: { type: DataTypes.JSONB, defaultValue: {} },
  customizations: { type: DataTypes.JSONB, defaultValue: [] },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'menu_items', underscored: true });

// ─── MenuCategory Model ─────────────────────────────────────────────────────
const MenuCategory = sequelize.define('MenuCategory', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'menu_categories', underscored: true });

// ─── Order Model ────────────────────────────────────────────────────────────
const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING(20), unique: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  items: { type: DataTypes.JSONB, allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  deliveryFee: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  tax: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.ENUM('card', 'upi', 'cod', 'wallet'), defaultValue: 'cod' },
  stripePaymentIntentId: { type: DataTypes.STRING },
  deliveryAddress: { type: DataTypes.JSONB, allowNull: false },
  specialInstructions: { type: DataTypes.TEXT },
  estimatedDelivery: { type: DataTypes.DATE },
  deliveredAt: { type: DataTypes.DATE },
  cancelReason: { type: DataTypes.TEXT },
  couponCode: { type: DataTypes.STRING(20) },
}, { tableName: 'orders', underscored: true });

// ─── Review Model ───────────────────────────────────────────────────────────
const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  restaurantId: { type: DataTypes.UUID, allowNull: false },
  orderId: { type: DataTypes.UUID },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  title: { type: DataTypes.STRING(200) },
  body: { type: DataTypes.TEXT },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  foodRating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  deliveryRating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  serviceRating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  helpfulVotes: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'reviews', underscored: true });

// ─── Coupon Model ───────────────────────────────────────────────────────────
const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  discountType: { type: DataTypes.ENUM('percentage', 'fixed'), defaultValue: 'percentage' },
  discountValue: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
  maxDiscount: { type: DataTypes.DECIMAL(8, 2) },
  minOrderValue: { type: DataTypes.DECIMAL(8, 2), defaultValue: 0 },
  usageLimit: { type: DataTypes.INTEGER },
  usageCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiresAt: { type: DataTypes.DATE },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'coupons', underscored: true });

// ─── Associations ───────────────────────────────────────────────────────────
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'restaurants' });

MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems' });

MenuItem.belongsTo(MenuCategory, { foreignKey: 'categoryId', as: 'menuCategory' });
MenuCategory.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'items' });

MenuCategory.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(MenuCategory, { foreignKey: 'restaurantId', as: 'menuCategories' });

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });

Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });

Review.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Review, { foreignKey: 'restaurantId', as: 'reviews' });

Review.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { User, Category, Restaurant, MenuItem, MenuCategory, Order, Review, Coupon };
