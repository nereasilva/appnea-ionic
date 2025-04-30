const express = require('express');
const router = express.Router();
const PhysiologicalData = require('../models/PhysiologicalData');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/physiological-data/my-data
// @desc    Get current patient's data
// @access  Private/Patient
router.get('/my-data', protect, authorize('Patient'), async (req, res) => {
  try {
    const data = await PhysiologicalData.find({ patientId: req.user.id })
      .sort({ timestamp: 1 });
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/physiological-data/patient/:patientId
// @desc    Get a specific patient's data (for doctors)
// @access  Private/Doctor
router.get('/patient/:patientId', protect, authorize('Doctor'), async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const data = await PhysiologicalData.find({ patientId })
      .sort({ timestamp: 1 });
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/physiological-data/generate-mock
// @desc    Generate mock data for the current patient
// @access  Private/Patient
router.post('/generate-mock', protect, authorize('Patient'), async (req, res) => {
  try {
    // Delete existing data for this patient
    await PhysiologicalData.deleteMany({ patientId: req.user.id });
    
    const mockData = [];
    const now = Date.now();
    
    // Generate 24 hourly data points for each type
    for (let i = 0; i < 24; i++) {
      const timestamp = now - (23 - i) * 60 * 60 * 1000; // Last 24 hours
      
      // Heart Rate: Normal range 60-100 bpm with some variation
      mockData.push({
        patientId: req.user.id,
        dataType: "HeartRate",
        value: 70 + Math.sin(i / 3) * 15 + Math.random() * 5,
        timestamp
      });
      
      // SpO2: Normal range 95-100% with occasional dips
      mockData.push({
        patientId: req.user.id,
        dataType: "SpO2",
        value: 97 + Math.sin(i / 2) * 2 + Math.random(),
        timestamp
      });
      
      // Snoring: Random events throughout the night (0-100 intensity)
      if (i > 8 && i < 20) { // More likely during night hours
        mockData.push({
          patientId: req.user.id,
          dataType: "Snoring",
          value: Math.random() * 60 + Math.sin(i) * 20,
          timestamp
        });
      }
    }
    
    // Insert mock data
    await PhysiologicalData.insertMany(mockData);
    
    // Retrieve the inserted data
    const data = await PhysiologicalData.find({ patientId: req.user.id })
      .sort({ timestamp: 1 });
    
    res.status(200).json({
      success: true,
      data
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
