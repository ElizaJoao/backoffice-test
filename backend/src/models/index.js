const sequelize = require('../database');
const User = require('./User');
const Company = require('./Company');
const PendingChange = require('./PendingChange');
const Country = require('./Country');

module.exports = {
  sequelize,
  User,
  Company,
  PendingChange,
  Country
};
