const express = require('express');
const router = express.Router();
const { ContactMessage } = require('../models');

// Submit contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const contactMessage = await ContactMessage.create({
      name,
      email,
      message
    });
    
    res.status(201).json('Message sent successfully');
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Get all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
