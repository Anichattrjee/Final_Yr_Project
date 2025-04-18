const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const voteRecordSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  // Encrypted vote data
  encryptedData: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Method to encrypt vote data
voteRecordSchema.statics.encryptVote = function(data, userId) {
  const key = process.env.JWT_SECRET + userId; // Using JWT_SECRET + userId as encryption key
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Method to decrypt vote data (only accessible by the voter)
voteRecordSchema.methods.decryptVote = function(userId) {
  const key = process.env.JWT_SECRET + userId;
  const bytes = CryptoJS.AES.decrypt(this.encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = mongoose.model('VoteRecord', voteRecordSchema);