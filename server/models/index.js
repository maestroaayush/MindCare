const sequelize = require('../config/database');
const User = require('./User');
const Session = require('./Session');
const Resource = require('./Resource');
const ContactMessage = require('./ContactMessage');

// Define any additional associations here if needed

module.exports = {
  sequelize,
  User,
  Session,
  Resource,
  ContactMessage
};
