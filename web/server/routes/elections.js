const express = require('express');
const Election = require('../models/Election');
const User = require('../models/User');
const VoteRecord = require('../models/VoteRecord');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

router.get("/test",(req,res)=>{
  res.send("test elections.");
})
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
  console.log("Single election controller.");
  try {
    const election = await Election.findById(req.params.id)
      .populate('candidates', 'username candidateInfo');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if user has already voted
    const hasVoted = election.voters.includes(req.user.userId);
    const electionObj=election.toObject();
    delete electionObj.voters;
    res.json({
      ...electionObj,
      hasVoted // Remove voters array from response
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
    });

    // // Validate candidates exist and are approved
    // const candidates = await User.find({
    //   _id: { $in: req.body.candidateIds },
    //   role: 'candidate',
    //   'candidateInfo.approved': true
    // });

    // if (candidates.length !== req.body.candidateIds.length) {
    //   return res.status(400).json({ message: 'Invalid or unapproved candidates selected' });
    // }

    const newElection = await election.save();
    res.status(201).json(newElection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//add candidates into election (admin only)
router.post("/add-candidates-to-election/:id",async (req,res)=>{
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    //get the electionId from req.params (sent from frontend)
    const {electionId}=req.params;
    //find the approved candidates whose electionCode=this election's id
    const approvedCandidates=await User.find({role:'candidate', electionCode:electionId, approved:true });
    //if this election doesnt have any candidates
    if(approvedCandidates.length===0)
    {
      return res.status(400).json({message:"No Candidates for this election yet."});
    }
    console.log(approvedCandidates);

    //find the election with this id
    const election=await Election.findById({electionId});
    
    if(!election){
      return res.status(400).json({message:"Election Doesn't Exist."});
    }

    //add the candidates to  this election
    election.candidates=approvedCandidates;

    res.status(200).json({messages:"Candidates Added to this election successfully.",election});
  } catch (error) {
    console.log("Error in add-candidates-to-election controller. ",error.message);
    res.status(500).json({message:error.message});
  }
});


// Cast vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }

    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ message: 'Election is not currently open for voting' });
    }

    if (election.voters.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    const candidateId = req.body.candidateId;
    if (!election.candidates.includes(candidateId)) {
      return res.status(404).json({ message: 'Invalid candidate' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create encrypted vote record
      const voteData = {
        electionTitle: election.title,
        candidateId: candidateId,
        timestamp: new Date()
      };

      const voteRecord = new VoteRecord({
        voter: req.user.userId,
        electionId: election._id,
        encryptedData: VoteRecord.encryptVote(voteData, req.user.userId)
      });

      await voteRecord.save({ session });

      // Update election
      election.voters.push(req.user.userId);
      election.totalVotes += 1;
      
      const resultIndex = election.results.findIndex(
        r => r.candidate.toString() === candidateId
      );
      
      if (resultIndex === -1) {
        election.results.push({ candidate: candidateId, votes: 1 });
      } else {
        election.results[resultIndex].votes += 1;
      }

      await election.save({ session });

      // Update user's voting status
      await User.findByIdAndUpdate(
        req.user.userId,
        { hasVoted: true },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.json({ message: 'Vote cast successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's voting history (only accessible by the voter)
router.get('/my-voting-history', auth, async (req, res) => {
  try {
    const voteRecords = await VoteRecord.find({ voter: req.user.userId })
      .sort({ createdAt: -1 });

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

module.exports = router;