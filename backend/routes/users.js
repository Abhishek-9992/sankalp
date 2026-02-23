const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select('-__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user (registration)
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email or ID already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user verification status
router.patch('/:id/verify', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { isVerified: true },
      { new: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple authentication endpoint (for demo purposes)
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, we'll accept any email with password "PublicUser123!"
    if (password !== 'PublicUser123!') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    let user = await User.findOne({ email }).select('-__v');
    
    // If user doesn't exist, create a demo user
    if (!user) {
      const newUser = new User({
        id: 'user_' + Date.now(),
        email: email,
        fullName: email.split('@')[0] || 'Demo User',
        role: 'public',
        isVerified: true
      });
      user = await newUser.save();
    }
    
    res.json({
      user,
      token: 'demo_token_' + user.id // Simple demo token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
