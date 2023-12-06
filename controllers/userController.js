const crypto = require('crypto');
const nodemailer = require('../utils/nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();



// Logic for initiating password reset
exports.forgotPassword = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
        port: 587,
        secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD, // Add your email password here
    },
  });
  try {
    const { email } = req.body;

    // Step 2: Find the user by email
    const user = await User.findOne({ email });

    // Step 3: If the user is not present, send an error message
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Step 5: Store the random string in the DB for later verification
    await user.save();

    // Step 6: Send password reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logic for handling password reset link
exports.resetPasswordLink = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if the token is not expired
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Token is valid, render the password reset form
    res.json({ message: 'Token verified', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Logic for updating password
exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password
    user.password = password;
    // Clear the reset token and expiry
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the updated user
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkUserExistence = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.signup = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: 'User registered successfully..', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
