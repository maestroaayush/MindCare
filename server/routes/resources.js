const router = require('express').Router();
const Resource = require('../models/Resource');

// GET all resources
router.get('/', async (req, res) => {
  try {
    const data = await Resource.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// POST a new resource (admin/psychiatrist only)
router.post('/', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
