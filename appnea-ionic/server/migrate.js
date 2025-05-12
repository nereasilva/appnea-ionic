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
  const now = Date.now();

  // Generate 24 hourly data points for each type
  for (let i = 0; i < 24; i++) {
    const timestamp = now - (23 - i) * 60 * 60 * 1000; // Last 24 hours

    // Heart Rate: Normal range 60-100 bpm with some variation
    mockData.push({
      patientId,
      dataType: "HeartRate",
      value: 70 + Math.sin(i / 3) * 15 + Math.random() * 5,
      timestamp
    });

    // SpO2: Normal range 95-100% with occasional dips
    mockData.push({
      patientId,
      dataType: "SpO2",
      value: 97 + Math.sin(i / 2) * 2 + Math.random(),
      timestamp
    });

    // Snoring: Random events throughout the night (0-100 intensity)
    if (i > 8 && i < 20) { // More likely during night hours
      mockData.push({
        patientId,
        dataType: "Snoring",
        value: Math.random() * 60 + Math.sin(i) * 20,
        timestamp
      });
    }
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

    // Check if patient has physiological data
    const dataCount = await PhysiologicalData.countDocuments({ patientId: patient._id });

    if (dataCount === 0) {
      console.log('Generating physiological data for test patient...');
      await generatePhysiologicalData(patient._id);
    } else {
      console.log(`Test patient already has ${dataCount} physiological data points`);
    }

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
