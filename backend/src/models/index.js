const sequelize = require('../database');
const User = require('./User');
const Company = require('./Company');
const PendingChange = require('./PendingChange');

module.exports = {
  sequelize,
  User,
  Company,
  PendingChange
};
