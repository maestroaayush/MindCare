const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');

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

// Get all contact messages
router.get('/contact-messages', auth, isAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update contact message status
router.put('/contact-messages/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json('Invalid status');
    }
    
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json('Contact message not found');
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete contact message
router.delete('/contact-messages/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json('Contact message not found');
    }
    
    res.json('Contact message deleted successfully');
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
    const totalMessages = await ContactMessage.countDocuments({});
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const inProgressMessages = await ContactMessage.countDocuments({ status: 'in-progress' });
    const resolvedMessages = await ContactMessage.countDocuments({ status: 'resolved' });
    
    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      patients,
      psychiatrists,
      totalMessages,
      newMessages,
      inProgressMessages,
      resolvedMessages
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
