const sequelize = require('../database');
const User = require('./User');
const Company = require('./Company');
const PendingChange = require('./PendingChange');
const Country = require('./Country');
const Employee = require('./Employee');

// Define associations
Company.hasMany(Employee, { foreignKey: 'company_id', as: 'employees' });
Employee.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

module.exports = {
  sequelize,
  User,
  Company,
  PendingChange,
  Country,
  Employee
};
