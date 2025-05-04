const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'EMAIL_EXISTS'
      });
    }

    console.log('Attempting to create user with:', { name, email });

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('User created successfully:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'EMAIL_EXISTS'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'EMAIL_NOT_FOUND'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'INVALID_PASSWORD'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/test-db
// @desc    Test database connection and user creation
// @access  Public
router.get('/test-db', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    const dbStateText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbState];

    console.log('Current MongoDB connection state:', dbStateText);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Count users
    const userCount = await User.countDocuments();

    // Create a test user
    const testEmail = `test${Date.now()}@example.com`;
    const testUser = new User({
      name: 'Test User',
      email: testEmail,
      password: 'password123'
    });

    console.log('Saving test user to database...');
    await testUser.save();
    console.log('Test user saved successfully');

    // Count users again
    const newUserCount = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        dbState: dbStateText,
        collections: collectionNames,
        userCountBefore: userCount,
        userCountAfter: newUserCount,
        testUserCreated: {
          id: testUser._id,
          email: testUser.email
        }
      }
    });
  } catch (err) {
    console.error('Test DB Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message,
      stack: err.stack
    });
  }
});

// @route   GET /api/auth/test-token
// @desc    Test token validation
// @access  Private
router.get('/test-token', protect, async (req, res) => {
  try {
    // If we get here, the token is valid
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error('Test token error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/test-doctor-role
// @desc    Test doctor role authorization
// @access  Private/Doctor
router.get('/test-doctor-role', protect, authorize('Doctor'), async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'You have Doctor role access',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error('Test doctor role error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/auth/test-patient-role
// @desc    Test patient role authorization
// @access  Private/Patient
router.get('/test-patient-role', protect, authorize('Patient'), async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'You have Patient role access',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error('Test patient role error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
