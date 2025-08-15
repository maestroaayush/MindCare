const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // JWT middleware
const upload = require('../middleware/upload');
const User = require('../models/User');


// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, role });
    await newUser.save();
    res.status(201).json("User registered");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json("Invalid credentials");
    }
    
    // Check approval status
    if (user.approvalStatus === 'pending') {
      return res.status(403).json("Your account is pending admin approval. Please wait for approval before logging in.");
    }
    
    if (user.approvalStatus === 'rejected') {
      return res.status(403).json("Your account has been rejected. Please contact support for more information.");
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user._id,
        name: user.name, 
        role: user.role,
        approvalStatus: user.approvalStatus
      } 
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/update', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const updates = { name: req.body.name };
    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.file) {
      updates.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json('Error updating profile');
  }
});


module.exports = router;
