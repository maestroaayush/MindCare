const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json('Access denied. Admin privileges required.');
    }
    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get all users for admin panel
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get users by approval status
router.get('/users/:status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const users = await User.find({ approvalStatus: status }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update user approval status
router.put('/users/:id/approval', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json('Invalid approval status');
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json('User not found');
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json('User not found');
    }
    
    res.json('User deleted successfully');
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get admin dashboard stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const pendingUsers = await User.countDocuments({ approvalStatus: 'pending' });
    const approvedUsers = await User.countDocuments({ approvalStatus: 'approved' });
    const rejectedUsers = await User.countDocuments({ approvalStatus: 'rejected' });
    const patients = await User.countDocuments({ role: 'patient' });
    const psychiatrists = await User.countDocuments({ role: 'psychiatrist' });
    
    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      patients,
      psychiatrists
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
