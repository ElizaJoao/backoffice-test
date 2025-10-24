const { Company, PendingChange } = require('../models');

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    // Create company with pending status
    const company = await Company.create({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record
    const pendingChange = await PendingChange.create({
      entityType: 'company',
      entityId: company.id,
      action: 'create',
      changeData: req.body,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.status(201).json({
      message: 'Company created and pending approval',
      company,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update company with pending status
    const oldData = company.toJSON();
    await company.update({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record for update
    const pendingChange = await PendingChange.create({
      entityType: 'company',
      entityId: company.id,
      action: 'update',
      changeData: req.body,
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'Company update pending approval',
      company,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update company status to pending for deletion
    const oldData = company.toJSON();
    await company.update({
      approvalStatus: 'pending'
    });

    // Create approval record for deletion
    const pendingChange = await PendingChange.create({
      entityType: 'company',
      entityId: company.id,
      action: 'delete',
      changeData: {},
      oldData: oldData,
      status: 'pending',
      requestedBy: req.body.requestedBy || 'Current User'
    });

    res.json({
      message: 'Company deletion pending approval',
      company,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCompanyHistory = async (req, res) => {
  try {
    const companyId = req.params.id;
    const changes = await PendingChange.findAll({
      where: {
        entityType: 'company',
        entityId: companyId
      },
      order: [['created_at', 'DESC']]
    });
    res.json(changes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
