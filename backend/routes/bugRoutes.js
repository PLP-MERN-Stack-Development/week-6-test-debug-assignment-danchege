const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');

// Get all bugs
router.get('/', async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new bug
router.post('/', async (req, res) => {
  const bug = new Bug({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'open',
    priority: req.body.priority || 'medium'
  });

  try {
    const newBug = await bug.save();
    res.status(201).json(newBug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a bug
router.patch('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    if (req.body.title) bug.title = req.body.title;
    if (req.body.description) bug.description = req.body.description;
    if (req.body.status) bug.status = req.body.status;
    if (req.body.priority) bug.priority = req.body.priority;

    const updatedBug = await bug.save();
    res.json(updatedBug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a bug
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (bug) {
      await bug.remove();
    }
    res.json({ message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
