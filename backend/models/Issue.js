const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  issueType: {
    type: String,
    required: true,
    enum: ['infrastructure', 'sanitation', 'safety', 'environment', 'transportation', 'other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  status: {
    type: String,
    required: true,
    enum: ['reported', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  photos: [{
    type: String // URLs to uploaded photos
  }],
  reportedBy: {
    type: String,
    required: true
  },
  assignedTo: String,
  viewCount: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  resolvedAt: Date,
  resolutionNotes: String
}, {
  timestamps: true
});

// Index for geospatial queries
issueSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model('Issue', issueSchema);
