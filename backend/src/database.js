const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
  dialectOptions: {
    timezone: '+00:00'
  },
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = sequelize;
