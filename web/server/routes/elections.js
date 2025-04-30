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
router.post("/add-candidate-to-election/:id",auth,async (req,res)=>{
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    //get the electionId from req.params (sent from frontend)
    const electionId=req.params.id;
    console.log("ElectionId: ",electionId);
    const candidateId=req.query.candidateId;
    console.log("CandidateId: ",candidateId);

    //find the approved candidate whose electionCode=this election's id
    const approvedCandidate = await User.findOne({
      _id: candidateId,
      // role: 'candidate',
      // candidateInfo: { $exists: true, $ne: null },
      // 'candidateInfo.electionCode': electionId,
      // 'candidateInfo.approved': true
    });
    
    //if this election doesnt have any candidates
    if(!approvedCandidate)
    {
      return res.status(404).json({message:"Candidate Not Found"});
    }
    console.log("Approved Candidate: ",approvedCandidate);

    //find the election with this id
    const election=await Election.findById(electionId);
    
    if(!election){
      return res.status(400).json({message:"Election Doesn't Exist."});
    }

    //add the candidates to  this election
    election.candidates.push(approvedCandidate);
    const updatedElection=  await election.save();

    res.status(200).json({messages:"Candidate Added to this election successfully.",updatedElection});
  } catch (error) {
    console.log("Error in add-candidates-to-election controller. ",error.message);
    res.status(500).json({message:error.message});
  }
});

//add voters to the election(right now not needed)
// router.post("/add-voters-to-election/:id",auth,async(req,res)=>{
//   try {
//     //extract the election id
//     const {id}=req.params;

//     //find the election
//     const election=await Election.findById(id);

//     if(!election)
//     {
//       return res.status(404).json({message:"Election doesn't exist."});
//     }

//     //now find the voters whose constituency=election.constituency
//     const voters=await User.find({role:'voter',constituency:election.constituency});

//     election.voters=voters;
//     const updatedElection=await election.save();

//     res.status(200).json({message:"Voters added to election successfully.", updatedElection});
//   } catch (error) {
//     console.log("Error in add-voters-to-election controller. ",error.message);
//     res.status(500).json({message:error.message});
//   }
// });

//get all candidates of an election
router.get("/:id/candidates",auth,async (req,res)=>{
  try {
    const {id}=req.params;

    const election=await Election.findById(id).populate('candidates');

    if(!election)
    {
      return res.status(404).json({message:"Election doesn't exist."});
    }

    res.status(200).json({candidates:election.candidates});
  } catch (error) {
    console.log("Error in get-candidates-election controller. ",error.message);
    res.status(500).json({message:error.message});
  }
})

// Cast vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    // 1. Fetch the election by ID from the URL parameter
    const election = await Election.findById(req.params.id);

    // 2. If no election found, return 404
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // 3. Check if election status is 'active' (extra validation)
    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }

    // 4. Check if the current time is within the election's allowed timeframe
    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ message: 'Election is not currently open for voting' });
    }

    // 5. Check if user has already voted in this election
    if (election.voters.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // 6. Get the candidateId from request body (which user voted for)
    const candidateId = req.body.candidateId;

    // 7. Validate if the candidateId is part of this election's candidate list
    if (!election.candidates.includes(candidateId)) {
      return res.status(404).json({ message: 'Invalid candidate' });
    }

    // 8. Start a database session for atomic transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 9. Prepare vote data (to be encrypted)
      const voteData = {
        electionTitle: election.title,     // For extra context in the encrypted record
        candidateId: candidateId,          // The chosen candidate
        timestamp: new Date()              // When the vote was cast
      };

      // 10. Create a new vote record with encrypted data
      const voteRecord = new VoteRecord({
        voter: req.user.userId,
        electionId: election._id,
        encryptedData: VoteRecord.encryptVote(voteData, req.user.userId) // Use custom encryption logic
      });

      // 11. Save the vote record to the database under this session
      await voteRecord.save({ session });

      // 12. Increment total vote count of the election
      election.totalVotes += 1;

      // 13. Check if this candidate already has an entry in results
      const resultIndex = election.results.findIndex(
        r => r.candidate.toString() === candidateId
      );

      // 14. If not found, create a new result entry for the candidate
      if (resultIndex === -1) {
        election.results.push({ candidate: candidateId, votes: 1 });
      } else {
        // 15. Else, increment the vote count for the candidate
        election.results[resultIndex].votes += 1;
      }

      // 16. Save the updated election document (totalVotes + results)
      await election.save({ session });

      // 17. Mark the user as hasVoted = true (so they can't vote again)
      await User.findByIdAndUpdate(
        req.user.userId,
        { hasVoted: true },
        { session }
      );

      // 18. Commit the transaction — all changes persist together
      await session.commitTransaction();
      session.endSession();

      // 19. Send success response
      res.json({ message: 'Vote cast successfully' });

    } catch (error) {
      // 20. If anything fails, roll back all changes
      await session.abortTransaction();
      session.endSession();
      throw error; // Let outer catch handle error
    }

  } catch (error) {
    // 21. Catch and respond with any errors
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