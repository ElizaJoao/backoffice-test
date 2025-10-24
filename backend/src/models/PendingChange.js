const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const PendingChange = sequelize.define('PendingChange', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entityType: {
    type: DataTypes.ENUM('user', 'company', 'country', 'employee'),
    allowNull: false,
    field: 'entity_type'
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'entity_id'
  },
  action: {
    type: DataTypes.ENUM('create', 'update', 'delete'),
    allowNull: false
  },
  changeData: {
    type: DataTypes.JSON,
    allowNull: false,
    field: 'change_data'
  },
  oldData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'old_data'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  requestedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'requested_by'
  },
  reviewedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reviewed_by'
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reviewed_at'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  }
}, {
  tableName: 'pending_changes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PendingChange;
