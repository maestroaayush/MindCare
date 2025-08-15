const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Session, User } = require('../models');

// Get sessions for current user
router.get('/', auth, async (req, res) => {
  try {
    let whereClause = {};
    
    if (req.user.role === 'patient') {
      whereClause.patientId = req.user.id;
    } else if (req.user.role === 'psychiatrist') {
      whereClause.psychiatristId = req.user.id;
    }
    
    const sessions = await Session.findAll({
      where: whereClause,
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
      order: [['date', 'ASC']]
    });
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all psychiatrists (for booking)
router.get('/psychiatrists', auth, async (req, res) => {
  try {
    const psychiatrists = await User.findAll({
      where: { 
        role: 'psychiatrist',
        approvalStatus: 'approved'
      },
      attributes: ['id', 'name', 'email', 'specialty'],
      order: [['name', 'ASC']]
    });
    
    res.json(psychiatrists);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Create new session (patients can now book sessions)
router.post('/', auth, async (req, res) => {
  try {
    let sessionData = req.body;
    
    // If patient is booking, set patientId to current user
    if (req.user.role === 'patient') {
      sessionData.patientId = req.user.id;
      sessionData.status = 'pending'; // Sessions start as pending
    }
    
    // Allow admin and psychiatrist to create sessions as before
    if (req.user.role !== 'admin' && req.user.role !== 'psychiatrist' && req.user.role !== 'patient') {
      return res.status(403).json('Access denied');
    }
    
    const session = await Session.create(sessionData);
    
    // Return session with user details
    const sessionWithDetails = await Session.findByPk(session.id, {
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
      ]
    });
    
    res.status(201).json(sessionWithDetails);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Update session
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    
    if (!session) {
      return res.status(404).json('Session not found');
    }
    
    // Check permissions
    if (req.user.role === 'patient' && session.patientId !== req.user.id) {
      return res.status(403).json('Access denied');
    }
    
    if (req.user.role === 'psychiatrist' && session.psychiatristId !== req.user.id) {
      return res.status(403).json('Access denied');
    }
    
    await Session.update(req.body, {
      where: { id: req.params.id }
    });
    
    const updatedSession = await Session.findByPk(req.params.id, {
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
      ]
    });
    
    res.json(updatedSession);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Delete session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    
    if (!session) {
      return res.status(404).json('Session not found');
    }
    
    // Check permissions
    if (req.user.role === 'patient' && session.patientId !== req.user.id) {
      return res.status(403).json('Access denied');
    }
    
    if (req.user.role === 'psychiatrist' && session.psychiatristId !== req.user.id) {
      return res.status(403).json('Access denied');
    }
    
    await Session.destroy({
      where: { id: req.params.id }
    });
    res.json('Session deleted');
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
