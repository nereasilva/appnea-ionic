const express = require('express');
const router = express.Router();
const PhysiologicalData = require('../models/PhysiologicalData');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/physiological-data/my-data
// @desc    Get current patient's data
// @access  Private/Patient
router.get('/my-data', protect, authorize('Patient'), async (req, res) => {
  try {
    console.log('Getting data for patient ID:', req.user._id);
    const data = await PhysiologicalData.find({ patientId: req.user._id })
      .sort({ timestamp: 1 });

    console.log(`Found ${data.length} data points for patient`);
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
  const now = new Date();
  const start = new Date(now);
  start.setHours(23, 0, 0, 0);
  if (now.getHours() < 7) {
    start.setDate(start.getDate() - 1);
  }

  // Values from excel
  const spo2Values = [
  9.49E-01,
  9.63E-01,
  9.36E-01,
  9.26E-01,
  9.40E-01,
  9.40E-01,
  9.20E-01,
  9.50E-01,
  9.30E-01

  ];

  const snoreValues = [
  5.91E-01,
  2.99E-01,
  6.73E-02,
  8.36E-01,
  4.15E-01,
  9.55E-02,
  5.66E-01,
  2.22E-02,
  3.23E-02

  ];

  const heartRateValues = [
    72.85,
    72.85,
    79.135,
    94.34,
    71.69,
    65.84,
    82.365,
    75.885,
    81.375
  ];
    const apnea = [
    false,
    false,
    false, 
    false,
    false,
    false,
    true,
    true,
    true
  ];

  for (let i = 0; i < 9; i++) {
    const timestamp = new Date(start.getTime() + i * 60 * 60 * 1000);

    mockData.push({
      patientId,
      dataType: "SpO2",
      value: spo2Values[i],
      timestamp,
      apnea: apnea[i]
    });

    mockData.push({
      patientId,
      dataType: "Snoring",
      value: snoreValues[i],
      timestamp,
      apnea: apnea[i]
    });

    mockData.push({
      patientId,
      dataType: "HeartRate",
      value: heartRateValues[i],
      timestamp,
      apnea: apnea[i]
    });
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
