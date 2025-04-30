const mongoose = require('mongoose');

const PhysiologicalDataSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  dataType: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
PhysiologicalDataSchema.index({ patientId: 1, timestamp: 1 });

module.exports = mongoose.model('PhysiologicalData', PhysiologicalDataSchema);
