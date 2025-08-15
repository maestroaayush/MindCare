const sequelize = require('../config/database');
const User = require('./User');
const Resource = require('./Resource');
const Session = require('./Session');
const ContactMessage = require('./ContactMessage');

// Define associations
User.hasMany(Resource, { foreignKey: 'authorId', as: 'resources' });
Resource.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Session, { foreignKey: 'patientId', as: 'patientSessions' });
User.hasMany(Session, { foreignKey: 'psychiatristId', as: 'psychiatristSessions' });
Session.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Session.belongsTo(User, { foreignKey: 'psychiatristId', as: 'psychiatrist' });

module.exports = {
  sequelize,
  User,
  Resource,
  Session,
  ContactMessage,
};
