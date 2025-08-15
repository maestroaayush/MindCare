const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Resource, User } = require('../models');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }],
      where: { isPublished: true }
    });
    res.json(resources);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }]
    });
    
    if (!resource) {
      return res.status(404).json('Resource not found');
    }
    
    // Increment views
    await resource.increment('views');
    
    res.json(resource);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Create new resource (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json('Access denied');
    }
    
    const resource = await Resource.create({
      ...req.body,
      authorId: req.user.id
    });
    
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Update resource (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json('Access denied');
    }
    
    await Resource.update(req.body, {
      where: { id: req.params.id }
    });
    
    const updatedResource = await Resource.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name']
      }]
    });
    
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Delete resource (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json('Access denied');
    }
    
    await Resource.destroy({
      where: { id: req.params.id }
    });
    
    res.json('Resource deleted');
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
