const express = require('express');
const Election = require('../models/Election');
const User = require('../models/User');
const VoteRecord = require('../models/VoteRecord');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

// Get all elections
router.get('/', auth, async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('candidates', 'username candidateInfo')
      .select('-voters');
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single election
router.get('/:id', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('candidates', 'username candidateInfo')
      .populate('voters', '_id') // Add this to properly get voters
      .lean(); // Convert to plain JavaScript object

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    const getElectionStatus = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (now < start) return 'upcoming';
      if (now > end) return 'completed';
      return 'active';
    };
    election.status = getElectionStatus(election.startDate, election.endDate);
    // Convert voters array to string IDs for easier checking
    const voterIds = election.voters.map(v => v._id.toString());
    const hasVoted = voterIds.includes(req.user.userId);

    // Remove sensitive data
    delete election.voters;

    res.json({
      ...election,
      hasVoted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create new election (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const election = new Election({
      title: req.body.title,
      description: req.body.description,
      constituency: req.body.constituency,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      candidates: req.body.candidateIds
    });

    const candidates = await User.find({
      _id: { $in: req.body.candidateIds },
      role: 'candidate',
      'candidateInfo.approved': true
    });

    if (candidates.length !== req.body.candidateIds.length) {
      return res.status(400).json({ message: 'Invalid or unapproved candidates selected' });
    }

    const newElection = await election.save();
    res.status(201).json(newElection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cast vote
router.post('/:id/vote', auth, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    if (req.user.role !== 'voter') {
      return res.status(403).json({ message: 'Only voters can cast votes' });
    }

    const election = await Election.findById(req.params.id).session(session);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Initialize voters array if undefined
    if (!election.voters) {
      election.voters = [];
    }

    const getElectionStatus = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (now < start) return 'upcoming';
      if (now > end) return 'completed';
      return 'active';
    };
    election.status = getElectionStatus(election.startDate, election.endDate);
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (election.status !== 'active' || now < startDate || now > endDate) {
      return res.status(400).json({ message: 'Election is not currently active' });
    }

    if (election.voters.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    const candidateId = req.body.candidateId;
    if (!election.candidates.map(c => c.toString()).includes(candidateId)) {
      return res.status(404).json({ message: 'Invalid candidate' });
    }

    // Create encrypted vote record
    const voteRecord = new VoteRecord({
      voter: req.user.userId,
      electionId: election._id,
      encryptedData: VoteRecord.encryptVote({
        electionTitle: election.title,
        candidateId: candidateId,
        timestamp: now
      }, req.user.userId)
    });

    await voteRecord.save({ session });

    // Update election
    election.voters.push(req.user.userId);
    election.totalVotes = (election.totalVotes || 0) + 1;

    // Update results
    const candidateObjectId = new mongoose.Types.ObjectId(candidateId);
    const resultIndex = election.results.findIndex(r => 
      r.candidate.equals(candidateObjectId)
    );

    if (resultIndex === -1) {
      election.results.push({ 
        candidate: candidateObjectId, 
        votes: 1 
      });
    } else {
      election.results[resultIndex].votes += 1;
    }

    // Update user's voting status
    await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { hasVoted: true } },
      { session }
    );

    const updatedElection = await election.save({ session });
    await session.commitTransaction();

    res.json({ 
      message: 'Vote cast successfully',
      election: {
        _id: updatedElection._id,
        totalVotes: updatedElection.totalVotes,
        results: updatedElection.results
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Voting error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to process vote'
    });
  } finally {
    session.endSession();
  }
});

// Get user's voting history (only accessible by the voter)
router.post('/my-voting-history', auth, async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  try {
    const voteRecords = await VoteRecord.find({ voter: userId })
      .sort({ createdAt: -1 });
      
    if (!voteRecords || voteRecords.length === 0) {
      return res.send({ message: 'No voting history found' });
    }
    
    const decryptedHistory = voteRecords.map(record => {
      try {
        return record.decryptVote(req.user.userId);
      } catch (error) {
        return null;
      }
    }).filter(record => record !== null);

    res.json(decryptedHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// End election and publish results (admin only)
router.post('/:id/end', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status === 'completed') {
      return res.status(400).json({ message: 'Election already completed' });
    }

    // Calculate percentages
    election.results.forEach(result => {
      result.percentage = (result.votes / election.totalVotes) * 100 || 0;
    });

    election.status = 'completed';
    election.isResultPublished = true;
    await election.save();

    // Populate candidate details for the response
    await election.populate('results.candidate', 'username candidateInfo');

    res.json({ 
      message: 'Election ended and results published', 
      results: election.results,
      totalVotes: election.totalVotes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get election results (if published)
router.get('/:id/results', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('candidates', 'username candidateInfo')
      .populate('results.candidate', 'username candidateInfo');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (!election.isResultPublished && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Results not yet published' });
    }

    res.json({
      title: election.title,
      description: election.description,
      constituency: election.constituency,
      status: election.status,
      startDate: election.startDate,
      endDate: election.endDate,
      totalVotes: election.totalVotes,
      results: election.results.map(result => ({
        candidate: {
          username: result.candidate.username,
          party: result.candidate.candidateInfo.party,
          position: result.candidate.candidateInfo.position
        },
        votes: result.votes,
        percentage: result.percentage
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/:id/elections', auth, async (req, res) => {
  try {
    const elections = await Election.find({
      candidates: req.params.id
    }).select('title startDate endDate status results');
    
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/start', auth, adminOnly, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Election.findByIdAndDelete(req.params.id);
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;