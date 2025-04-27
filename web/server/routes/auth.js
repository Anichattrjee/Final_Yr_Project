const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const emailService = require("../services/emailService");
const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, voterID, role, candidateInfo } =
      req.body;

    // Validate required fields
    if (!username || !email || !password || !voterID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { voterID }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    

    const userData = {
      username,
      email:email,
      password:password.trim(),
      voterID,
      role:role || "voter",
    };

    if (role === "candidate") {
      if (
        !candidateInfo?.party ||
        !candidateInfo?.position ||
        !candidateInfo?.constituency
      ) {
        return res
          .status(400)
          .json({ message: "Missing candidate information" });
      }

      userData.candidateInfo = {
        ...candidateInfo,
        approved: role === "candidate" ? false : undefined,
      };
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message:
        role === "candidate"
          ? "Registration successful! Awaiting admin approval."
          : "Registration successful!",
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(email);
    console.log(password);
    

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user with case-insensitive email match
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials: no user" });
    }

    console.log(user);

    // Verify password exists in user document
    if (!user.password) {
      return res.status(500).json({ message: "Authentication system error" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials: password not match" });
    }

    // For candidates, check if approved
    if (user.role === "candidate" && !user.candidateInfo.approved) {
      return res
        .status(401)
        .json({ message: "Candidate account pending approval" });
    }

    const jwtSecret = process.env.JWT_SECRET || "your-secure-secret-key";
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "24h",
    });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        token: token,
        email: user.email,
        role: user.role,
        hasVoted: user.hasVoted,
        candidateInfo: user.candidateInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot password - request reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({
        message:
          "If a user with this email exists, a password reset link will be sent.",
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    await emailService.sendPasswordResetEmail(user.email, resetURL, {
      name: user.username,
    });

    res.status(200).json({
      message:
        "If a user with this email exists, a password reset link will be sent.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
});

// Reset password with token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || !token) {
      return res
        .status(400)
        .json({ message: "Password and token are required" });
    }

    // Hash the token for comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

module.exports = router;
