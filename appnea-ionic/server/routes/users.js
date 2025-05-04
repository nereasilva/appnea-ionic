const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    console.log('Getting profile for user ID:', req.user._id);
    const user = await User.findById(req.user._id);

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

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name } = req.body;

    console.log('Updating profile for user ID:', req.user._id);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    );

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

// @route   POST /api/users/set-role
// @desc    Set user role
// @access  Private
router.post('/set-role', protect, async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!role || !['Patient', 'Doctor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Check if user already has a role
    if (req.user.role !== null) {
      return res.status(400).json({
        success: false,
        message: 'User role already set'
      });
    }

    console.log('Setting role for user ID:', req.user._id, 'to:', role);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role },
      { new: true, runValidators: true }
    );

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

// @route   GET /api/users/patients
// @desc    Get all patients (for doctors)
// @access  Private/Doctor
router.get('/patients', protect, authorize('Doctor'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('_id email name');

    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/doctors
// @desc    Get all doctors (for patients)
// @access  Private/Patient
router.get('/doctors', protect, authorize('Patient'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('_id email name');

    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
