const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Session = sequelize.define('Session', {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  sessionType: {
    type: DataTypes.ENUM('individual', 'group', 'emergency'),
    defaultValue: 'individual'
  }
}, {
  timestamps: true
});

// Define associations
Session.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Session.belongsTo(User, { as: 'psychiatrist', foreignKey: 'psychiatristId' });

module.exports = Session;
