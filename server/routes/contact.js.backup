const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// Submit contact form
router.post('/submit', async (req, res) => {
  try {
  const { name, email, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  const contactMessage = new ContactMessage({
    name,
    email,
    message
  });
  
  await contactMessage.save();
    
    res.status(201).json({ 
      message: 'Contact message submitted successfully',
      contactMessage 
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

module.exports = router;
