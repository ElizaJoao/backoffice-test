const { User, PendingChange } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    // Create user with pending status
    const user = await User.create({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record
    const pendingChange = await PendingChange.create({
      entityType: 'user',
      entityId: user.id,
      action: 'create',
      changeData: req.body,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.status(201).json({
      message: 'User created and pending approval',
      user,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user with pending status
    const oldData = user.toJSON();
    await user.update({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record for update
    const pendingChange = await PendingChange.create({
      entityType: 'user',
      entityId: user.id,
      action: 'update',
      changeData: req.body,
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'User update pending approval',
      user,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user status to pending for deletion
    const oldData = user.toJSON();
    await user.update({
      approvalStatus: 'pending'
    });

    // Create approval record for deletion
    const pendingChange = await PendingChange.create({
      entityType: 'user',
      entityId: user.id,
      action: 'delete',
      changeData: {},
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'User deletion pending approval',
      user,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoles = (req, res) => {
  res.json(['Admin', 'Viewer', 'Sales', 'Finance', 'Developer', 'Designer', 'Tester']);
};

exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    const changes = await PendingChange.findAll({
      where: {
        entityType: 'user',
        entityId: userId
      },
      order: [['created_at', 'DESC']]
    });
    res.json(changes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
