const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Resource = sequelize.define('Resource', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('article', 'video', 'tool', 'guide', 'podcast'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('anxiety', 'depression', 'stress', 'self-care', 'mindfulness', 'general'),
    defaultValue: 'general'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

// Define associations
Resource.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

module.exports = Resource;
