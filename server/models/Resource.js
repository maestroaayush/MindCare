const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  type: { type: String, enum: ['article', 'video', 'tool'] }
});

module.exports = mongoose.model('Resource', resourceSchema);
