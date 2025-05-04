const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['Patient', 'Doctor', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// No password encryption for mock project

// Match user entered password to plain text password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', UserSchema);
