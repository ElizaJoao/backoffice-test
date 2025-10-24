const { PendingChange, User, Company, Country, Employee } = require('../models');

exports.getPendingChanges = async (req, res) => {
  try {
    const pendingChanges = await PendingChange.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'DESC']]
    });
    res.json(pendingChanges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveChange = async (req, res) => {
  try {
    const pendingChange = await PendingChange.findByPk(req.params.id);
    if (!pendingChange) {
      return res.status(404).json({ error: 'Pending change not found' });
    }

    if (pendingChange.status !== 'pending') {
      return res.status(400).json({ error: 'Change already processed' });
    }

    const { entityType, action, entityId } = pendingChange;

    let result;
    if (entityType === 'user') {
      if (action === 'create' || action === 'update') {
        // Update user approval status to approved
        await User.update({ approvalStatus: 'approved' }, { where: { id: entityId } });
        result = await User.findByPk(entityId);
      } else if (action === 'delete') {
        // Delete the user
        await User.destroy({ where: { id: entityId } });
        result = { message: 'User deleted' };
      }
    } else if (entityType === 'company') {
      if (action === 'create' || action === 'update') {
        // Update company approval status to approved
        await Company.update({ approvalStatus: 'approved' }, { where: { id: entityId } });
        result = await Company.findByPk(entityId);
      } else if (action === 'delete') {
        // Delete the company
        await Company.destroy({ where: { id: entityId } });
        result = { message: 'Company deleted' };
      }
    } else if (entityType === 'country') {
      if (action === 'create' || action === 'update') {
        // Update country approval status to approved
        await Country.update({ approvalStatus: 'approved' }, { where: { id: entityId } });
        result = await Country.findByPk(entityId);
      } else if (action === 'delete') {
        // Delete the country
        await Country.destroy({ where: { id: entityId } });
        result = { message: 'Country deleted' };
      }
    } else if (entityType === 'employee') {
      if (action === 'create' || action === 'update') {
        // Update employee approval status to approved
        await Employee.update({ approvalStatus: 'approved' }, { where: { id: entityId } });
        result = await Employee.findByPk(entityId);
      } else if (action === 'delete') {
        // Delete the employee
        await Employee.destroy({ where: { id: entityId } });
        result = { message: 'Employee deleted' };
      }
    }

    // Update pending change status
    await pendingChange.update({
      status: 'approved',
      reviewedBy: req.body.reviewedBy || 'Admin',
      reviewedAt: new Date()
    });

    res.json({
      message: 'Change approved successfully',
      pendingChange,
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectChange = async (req, res) => {
  try {
    const pendingChange = await PendingChange.findByPk(req.params.id);
    if (!pendingChange) {
      return res.status(404).json({ error: 'Pending change not found' });
    }

    if (pendingChange.status !== 'pending') {
      return res.status(400).json({ error: 'Change already processed' });
    }

    const { entityType, entityId } = pendingChange;

    // Update entity approval status to rejected
    if (entityType === 'user') {
      await User.update({ approvalStatus: 'rejected' }, { where: { id: entityId } });
    } else if (entityType === 'company') {
      await Company.update({ approvalStatus: 'rejected' }, { where: { id: entityId } });
    } else if (entityType === 'country') {
      await Country.update({ approvalStatus: 'rejected' }, { where: { id: entityId } });
    } else if (entityType === 'employee') {
      await Employee.update({ approvalStatus: 'rejected' }, { where: { id: entityId } });
    }

    // Update pending change status
    await pendingChange.update({
      status: 'rejected',
      reviewedBy: req.body.reviewedBy || 'Admin',
      reviewedAt: new Date(),
      rejectionReason: req.body.reason || 'No reason provided'
    });

    res.json({
      message: 'Change rejected successfully',
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChangeHistory = async (req, res) => {
  try {
    const changes = await PendingChange.findAll({
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(changes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
