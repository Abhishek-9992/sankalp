const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: String,
  role: {
    type: String,
    enum: ['public', 'government', 'school'],
    default: 'public'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    avatar: String,
    bio: String,
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
