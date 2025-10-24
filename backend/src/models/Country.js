const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Country = sequelize.define('Country', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(3),
    allowNull: false,
    unique: true,
    comment: 'ISO 3166-1 alpha-3 country code'
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Geographic region (e.g., Europe, Asia, Americas)'
  },
  capital: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Area in square kilometers'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  approvalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: true,
    field: 'approval_status'
  }
}, {
  tableName: 'countries',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Country;
