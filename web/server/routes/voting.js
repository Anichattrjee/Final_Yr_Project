const express = require("express");
const Candidate = require("../models/candidate.js");
const router = express.Router();

router.post("/vote", async (req, res) => {
  const { candidateId } = req.body;

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });

    candidate.votes += 1;
    await candidate.save();
    res.status(200).json({ message: "Vote cast successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error casting vote" });
  }
});

router.get("/results", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Error fetching results" });
  }
});

module.exports = router;
