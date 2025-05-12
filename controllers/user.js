const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists (including soft-deleted users)
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }],
      isDeleted: false
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isDeleted: false
    });

    const savedUser = await user.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new username or email is already taken
    if (username || email) {
      const existingUser = await User.findOne({
        $or: [
          { email: email || user.email },
          { username: username || user.username }
        ],
        _id: { $ne: user._id },
        isDeleted: false
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username or email already taken' 
        });
      }
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    
    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 