const router = require('express').Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// GET all resources with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, difficulty, page = 1, limit = 10 } = req.query;
    
    let query = { isPublished: true };
    
    // Add filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const resources = await Resource.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Resource.countDocuments(query);
    
    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific resource by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('author', 'name email specialization');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment view count
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new resource (psychiatrist only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'psychiatrist') {
      return res.status(403).json({ message: 'Only psychiatrists can create resources' });
    }
    
    const resource = new Resource({
      ...req.body,
      author: req.user.id
    });
    
    await resource.save();
    
    const populatedResource = await Resource.findById(resource._id)
      .populate('author', 'name email');
    
    res.status(201).json(populatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a resource
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Only the author can update the resource
    if (resource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'name email');
    
    res.json(updatedResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Only the author can delete the resource
    if (resource.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST like a resource
router.post('/:id/like', auth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({ likes: resource.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET resource categories
router.get('/meta/categories', auth, async (req, res) => {
  try {
    const categories = await Resource.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET resource types
router.get('/meta/types', auth, async (req, res) => {
  try {
    const types = await Resource.distinct('type');
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
