const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sequelize = require('sequelize');
require('dotenv').config();

// Register a new user
exports.signup = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    // Validate input
    if (!Username || !Email || !Password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (Password.length < 3) {
      return res.status(400).json({ message: 'Password must be at least 3 characters long' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { Username },
          { Email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Create new user
    const user = await User.create({
      Username,
      Email,
      Password
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Email: user.Email
      },
      token
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    // Validate input
    if (!Username || !Password) {
      return res.status(400).json({ message: 'Username and Password are required' });
    }

    // Find user by username
    const user = await User.findOne({ where: { Username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.validPassword(Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        UserID: user.UserID,
        Username: user.Username,
        Email: user.Email
      },
      token
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
