const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Only admins can access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Only admins or the user themselves can view this information
    if (req.user.role !== 'admin' && req.user.id !== user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only admins can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
