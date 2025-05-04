/**
 * Punycode Fix: Redirect the deprecated built-in punycode module to the userland package
 * This eliminates the [DEP0040] DeprecationWarning when running the server
 */
(function() {
  // Save the original require function
  const originalRequire = module.constructor.prototype.require;

  // Override the require function to intercept punycode imports
  module.constructor.prototype.require = function(modulePath) {
    // If someone is requiring the built-in punycode module
    if (modulePath === 'punycode') {
      // Redirect to the userland punycode package
      // The trailing slash is important to avoid an infinite loop
      return originalRequire.call(this, 'punycode/');
    }

    // For all other modules, use the original require
    return originalRequire.apply(this, arguments);
  };

  // Silent fix - no console output
})();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const physiologicalDataRoutes = require('./routes/physiologicalData');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
    // List all collections in the database
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('Available collections:', collections.map(c => c.name));
      })
      .catch(err => console.error('Error listing collections:', err));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection
const connectedUsers = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    connectedUsers[userId] = socket.id;
    console.log(`User connected: ${userId}`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      delete connectedUsers[userId];
      console.log(`User disconnected: ${userId}`);
    }
  });
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/physiological-data', physiologicalDataRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('APPNEA API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
