const { Employee, Company, PendingChange } = require('../models');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name']
      }]
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    // Create employee with pending status
    const employee = await Employee.create({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record
    const pendingChange = await PendingChange.create({
      entityType: 'employee',
      entityId: employee.id,
      action: 'create',
      changeData: req.body,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.status(201).json({
      message: 'Employee created and pending approval',
      employee,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update employee with pending status
    const oldData = employee.toJSON();
    await employee.update({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record for update
    const pendingChange = await PendingChange.create({
      entityType: 'employee',
      entityId: employee.id,
      action: 'update',
      changeData: req.body,
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'Employee update pending approval',
      employee,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update employee status to pending for deletion
    const oldData = employee.toJSON();
    await employee.update({
      approvalStatus: 'pending'
    });

    // Create approval record for deletion
    const pendingChange = await PendingChange.create({
      entityType: 'employee',
      entityId: employee.id,
      action: 'delete',
      changeData: {},
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'Employee deletion pending approval',
      employee,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeHistory = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const changes = await PendingChange.findAll({
      where: {
        entityType: 'employee',
        entityId: employeeId
      },
      order: [['created_at', 'DESC']]
    });
    res.json(changes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
