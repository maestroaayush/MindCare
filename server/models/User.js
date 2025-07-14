const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'psychiatrist', 'admin'], default: 'patient' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  profilePic: { type: String },
  
  // Additional fields for psychiatrists
  specialization: { type: String },
  licenseNumber: { type: String },
  experience: { type: Number }, // years
  bio: { type: String },
  
  // Additional fields for patients
  dateOfBirth: { type: Date },
  phone: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  },
  
  // Common fields
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
