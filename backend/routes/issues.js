const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');

// Get all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues by reporter
router.get('/reporter/:userId', async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues by assignee
router.get('/assignee/:userId', async (req, res) => {
  try {
    const issues = await Issue.find({ assignedTo: req.params.userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues by location (query params for radius)
router.get('/location/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const radius = req.query.radius || 10;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Simple bounding box query (for more precise geo queries, use MongoDB's geospatial features)
    const latRange = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
    const lngRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    const issues = await Issue.find({
      'location.latitude': {
        $gte: latitude - latRange,
        $lte: latitude + latRange
      },
      'location.longitude': {
        $gte: longitude - lngRange,
        $lte: longitude + lngRange
      }
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues by type
router.get('/type/:issueType', async (req, res) => {
  try {
    const issues = await Issue.find({ issueType: req.params.issueType }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get issues by severity
router.get('/severity/:severity', async (req, res) => {
  try {
    const issues = await Issue.find({ severity: req.params.severity }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    // Increment view count
    issue.viewCount += 1;
    await issue.save();
    
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new issue
router.post('/', async (req, res) => {
  try {
    const issue = new Issue(req.body);
    const savedIssue = await issue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update issue
router.put('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json(issue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update issue status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const updateData = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      if (resolutionNotes) {
        updateData.resolutionNotes = resolutionNotes;
      }
    }
    
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upvote issue
router.patch('/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete issue
router.delete('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
