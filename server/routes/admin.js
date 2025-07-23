const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
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
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get users by approval status
router.get('/users/:status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const users = await User.findAll({
      where: { approvalStatus: status },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
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
    
    await User.update(
      { approvalStatus },
      { where: { id } }
    );

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
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
    const deleted = await User.destroy({
      where: { id }
    });
    
    if (!deleted) {
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
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
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
    
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json('Invalid status');
    }
    
    await ContactMessage.update(
      { status },
      { where: { id } }
    );

    const message = await ContactMessage.findByPk(id);
    
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
    const deleted = await ContactMessage.destroy({
      where: { id }
    });
    
    if (!deleted) {
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
    const totalUsers = await User.count();
    const pendingUsers = await User.count({ where: { approvalStatus: 'pending' } });
    const approvedUsers = await User.count({ where: { approvalStatus: 'approved' } });
    const rejectedUsers = await User.count({ where: { approvalStatus: 'rejected' } });
    const patients = await User.count({ where: { role: 'patient' } });
    const psychiatrists = await User.count({ where: { role: 'psychiatrist' } });
    const totalMessages = await ContactMessage.count();
    const newMessages = await ContactMessage.count({ where: { status: 'new' } });
    const readMessages = await ContactMessage.count({ where: { status: 'read' } });
    const repliedMessages = await ContactMessage.count({ where: { status: 'replied' } });
    const archivedMessages = await ContactMessage.count({ where: { status: 'archived' } });
    
    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      patients,
      psychiatrists,
      totalMessages,
      newMessages,
      readMessages,
      repliedMessages,
      archivedMessages
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
