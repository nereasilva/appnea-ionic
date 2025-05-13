const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Message = require('./models/Message');
const PhysiologicalData = require('./models/PhysiologicalData');

// Function to generate physiological data for a patient
const generatePhysiologicalData = async (patientId) => {
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
  console.log(`Generated ${mockData.length} physiological data points for patient`);
};

// Main migration function
const migrate = async () => {
  try {
    console.log('Starting database migration...');
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB connected successfully');

    // Get database connection
    const db = mongoose.connection;

    // List all collections
    const collections = await db.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log('Existing collections:', collectionNames);

    // Check if users collection exists
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await db.createCollection('users');
    }

    // Check if messages collection exists
    if (!collectionNames.includes('messages')) {
      console.log('Creating messages collection...');
      await db.createCollection('messages');
    }

    // Check if physiologicaldata collection exists
    if (!collectionNames.includes('physiologicaldatas')) {
      console.log('Creating physiologicaldata collection...');
      await db.createCollection('physiologicaldatas');
    }

    // Check if test patient exists
    let patient = await User.findOne({ email: 'paciente@test.com' });

    if (!patient) {
      console.log('Creating test patient user...');
      patient = await User.create({
        email: 'paciente@test.com',
        password: 'paciente123',
        name: 'paciente de prueba',
        role: 'Patient'
      });
      console.log('Test patient created with ID:', patient._id);
    } else {
      console.log('Test patient already exists with ID:', patient._id);
      // Update the name if it's different
      if (patient.name !== 'paciente de prueba') {
        console.log('Updating patient name to "paciente de prueba"...');
        patient.name = 'paciente de prueba';
        await patient.save();
        console.log('Patient name updated successfully');
      }
    }

    // Check if test doctor exists
    let doctor = await User.findOne({ email: 'doctor@test.com' });

    if (!doctor) {
      console.log('Creating test doctor user...');
      doctor = await User.create({
        email: 'doctor@test.com',
        password: 'doctor123',
        name: 'doctor de prueba',
        role: 'Doctor'
      });
      console.log('Test doctor created with ID:', doctor._id);
    } else {
      console.log('Test doctor already exists with ID:', doctor._id);
      // Update the name if it's different
      if (doctor.name !== 'doctor de prueba') {
        console.log('Updating doctor name to "doctor de prueba"...');
        doctor.name = 'doctor de prueba';
        await doctor.save();
        console.log('Doctor name updated successfully');
      }
    }

    // Create physiological data
    console.log('Deleting existing physiological data for test patient...');
    await PhysiologicalData.deleteMany({ patientId: patient._id });

    console.log('Generating physiological data for test patient...');
    await generatePhysiologicalData(patient._id)

    console.log('Migration completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Patient: paciente@test.com / paciente123');
    console.log('Doctor: doctor@test.com / doctor123');

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Migration failed:', error);
    // Close the connection on error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
    process.exit(1);
  }
};

// Run the migration
migrate();
