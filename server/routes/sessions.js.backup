const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');
const auth = require('../middleware/auth');

// GET all sessions for a user (patient or psychiatrist)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If user is a patient, show their sessions
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } 
    // If user is a psychiatrist, show sessions they conduct
    else if (req.user.role === 'psychiatrist') {
      query.psychiatrist = req.user.id;
    }

    const sessions = await Session.find(query)
      .populate('patient', 'name email')
      .populate('psychiatrist', 'name email specialization')
      .sort({ date: 1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET upcoming sessions for a user
router.get('/upcoming', auth, async (req, res) => {
  try {
    let query = {
      date: { $gte: new Date() },
      status: 'scheduled'
    };
    
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'psychiatrist') {
      query.psychiatrist = req.user.id;
    }

    const sessions = await Session.find(query)
      .populate('patient', 'name email')
      .populate('psychiatrist', 'name email specialization')
      .sort({ date: 1 })
      .limit(5);

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new session (psychiatrist only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'psychiatrist') {
      return res.status(403).json({ message: 'Only psychiatrists can create sessions' });
    }

    const { patientId, date, time, duration, sessionType } = req.body;
    
    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const session = new Session({
      patient: patientId,
      psychiatrist: req.user.id,
      date,
      time,
      duration,
      sessionType
    });

    await session.save();
    
    const populatedSession = await Session.findById(session._id)
      .populate('patient', 'name email')
      .populate('psychiatrist', 'name email specialization');

    res.status(201).json(populatedSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a session
router.put('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user has permission to update this session
    if (req.user.role === 'patient' && session.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'psychiatrist' && session.psychiatrist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('patient', 'name email')
      .populate('psychiatrist', 'name email specialization');

    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only psychiatrists can delete sessions
    if (req.user.role !== 'psychiatrist' || session.psychiatrist.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all psychiatrists (for booking sessions)
router.get('/psychiatrists', auth, async (req, res) => {
  try {
    const psychiatrists = await User.find({ 
      role: 'psychiatrist', 
      isActive: true 
    }).select('name email specialization experience bio');
    
    res.json(psychiatrists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
