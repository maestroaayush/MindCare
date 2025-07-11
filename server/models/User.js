const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'psychiatrist'], default: 'patient' },
  profilePic: { type: String }

});

module.exports = mongoose.model('User', userSchema);
