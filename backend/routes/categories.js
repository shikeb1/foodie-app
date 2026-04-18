const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
    res.json({ categories });
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (err) { next(err); }
});

module.exports = router;
