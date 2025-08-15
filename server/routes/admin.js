const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Resource, Session, ContactMessage } = require('../models');

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json('Admin access required');
  }
  next();
};

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
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

// Get users by status
router.get('/users/:status', auth, adminAuth, async (req, res) => {
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
router.put('/users/:id/approval', auth, adminAuth, async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    
    await User.update(
      { approvalStatus },
      { where: { id: req.params.id } }
    );
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    res.json('User deleted successfully');
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Get dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const pendingUsers = await User.count({ where: { approvalStatus: 'pending' } });
    const approvedUsers = await User.count({ where: { approvalStatus: 'approved' } });
    const rejectedUsers = await User.count({ where: { approvalStatus: 'rejected' } });
    const totalPatients = await User.count({ where: { role: 'patient' } });
    const totalPsychiatrists = await User.count({ where: { role: 'psychiatrist' } });
    const totalResources = await Resource.count();
    const totalSessions = await Session.count();
    const contactMessages = await ContactMessage.count();
    
    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      totalPatients,
      totalPsychiatrists,
      totalResources,
      totalSessions,
      contactMessages
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all sessions (admin view)
router.get('/sessions', auth, adminAuth, async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'psychiatrist',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'DESC']]
    });
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all resources (admin view)
router.get('/resources', auth, adminAuth, async (req, res) => {
  try {
    const resources = await Resource.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(resources);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all contact messages
router.get('/contact-messages', auth, adminAuth, async (req, res) => {
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
router.put('/contact-messages/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    await ContactMessage.update(
      { status },
      { where: { id: req.params.id } }
    );
    
    const updatedMessage = await ContactMessage.findByPk(req.params.id);
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
