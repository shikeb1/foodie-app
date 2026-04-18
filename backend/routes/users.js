const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { User } = require('../models');

// @desc  Get user profile
router.get('/profile', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// @desc  Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, avatar, addresses } = req.body;
    await req.user.update({ name, phone, avatar, addresses });
    res.json({ message: 'Profile updated', user: req.user });
  } catch (err) { next(err); }
});

// @desc  Add address
router.post('/addresses', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addresses = [...(user.addresses || []), { id: Date.now(), ...req.body }];
    await user.update({ addresses });
    res.json({ message: 'Address added', addresses });
  } catch (err) { next(err); }
});

// @desc  Delete address
router.delete('/addresses/:addressId', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addresses = (user.addresses || []).filter(a => String(a.id) !== req.params.addressId);
    await user.update({ addresses });
    res.json({ message: 'Address removed', addresses });
  } catch (err) { next(err); }
});

module.exports = router;
