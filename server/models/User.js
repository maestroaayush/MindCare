const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('patient', 'psychiatrist', 'admin'),
    defaultValue: 'patient'
  },
  approvalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  profilePic: {
    type: DataTypes.STRING
  },
  specialization: {
    type: DataTypes.STRING
  },
  licenseNumber: {
    type: DataTypes.STRING
  },
  experience: {
    type: DataTypes.INTEGER
  },
  bio: {
    type: DataTypes.TEXT
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  phone: {
    type: DataTypes.STRING
  },
  emergencyContactName: {
    type: DataTypes.STRING
  },
  emergencyContactPhone: {
    type: DataTypes.STRING
  },
  emergencyContactRelation: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      notifications: true,
      theme: 'light',
      language: 'en'
    }
  }
}, {
  timestamps: true
});

module.exports = User;
