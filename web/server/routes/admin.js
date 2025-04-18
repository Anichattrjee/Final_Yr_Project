const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get pending candidate approvals
router.get('/pending-candidates', auth, adminOnly, async (req, res) => {
  try {
    const pendingCandidates = await User.find({
      role: 'candidate',
      'candidateInfo.approved': false
    });
    res.json(pendingCandidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject candidate
router.post('/approve-candidate/:id', auth, adminOnly, async (req, res) => {
  try {
    const { approved } = req.body;
    const candidate = await User.findById(req.params.id);
    
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.candidateInfo.approved = approved;
    await candidate.save();

    res.json({ 
      message: `Candidate ${approved ? 'approved' : 'rejected'} successfully`,
      candidate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to your admin routes file
router.get('/approved-candidates', auth, adminOnly, async (req, res) => {
  try {
    const approvedCandidates = await User.find({
      role: 'candidate',
      'candidateInfo.approved': true
    });
    res.json(approvedCandidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;