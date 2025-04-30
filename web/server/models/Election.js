const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  votes: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  }
});

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  constituency: {
    type: String,
  },
  startDate: {
    type: Date,
    default:()=>new Date(),
  },
  endDate: {
    type: Date,
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  results: [resultSchema],
  isResultPublished: {
    type: Boolean,
    default: false
  },
  totalVotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure endDate is always 30 minutes after startDate
electionSchema.pre('save', function (next) {
  const now = new Date();

  // Set endDate if not provided
  if (!this.endDate && this.startDate) {
    this.endDate = new Date(this.startDate.getTime() + 30 * 60 * 1000);
  }

  // Set status based on current time
  if (now < this.startDate) {
    this.status = 'upcoming';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else {
    this.status = 'completed';
  }

  next();
});

//to re-evaluate status dynamically when fetching a document
electionSchema.methods.getCurrentStatus = function () {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'active';
  return 'completed';
};

module.exports = mongoose.model('Election', electionSchema);