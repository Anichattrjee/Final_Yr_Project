const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, voterID, role, candidateInfo } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !voterID) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { voterID }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username,
      email,
      password: hashedPassword, // Store hashed password
      voterID,
      role: role || 'voter'
    };

    if (role === 'candidate') {
      if (!candidateInfo?.party || !candidateInfo?.position || !candidateInfo?.constituency) {
        return res.status(400).json({ message: 'Missing candidate information' });
      }
      
      userData.candidateInfo = {
        ...candidateInfo,
        approved: role === 'candidate' ? false : undefined
      };
    }

    const user = new User(userData);
    await user.save();
    
    res.status(201).json({ 
      message: role === 'candidate' 
        ? 'Registration successful! Awaiting admin approval.' 
        : 'Registration successful!' 
    });
    
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trim and validate inputs
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with case-insensitive email match
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password exists in user document
    if (!user.password) {
      return res.status(500).json({ message: 'Authentication system error' });
    }

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }
    
    // For candidates, check if approved
    if (user.role === 'candidate' && !user.candidateInfo.approved) {
      return res.status(401).json({ message: 'Candidate account pending approval' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      
      user: {
        id: user._id,
        username: user.username,
        token: token,
        email: user.email,
        role: user.role,
        hasVoted: user.hasVoted,
        candidateInfo: user.candidateInfo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request password reset
router.post('/reset-password-request', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    // In a real application, send this token via email
    res.json({ 
      message: 'Password reset token generated',
      resetToken // In production, this should be sent via email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;