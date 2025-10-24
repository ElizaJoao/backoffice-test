const { Country, PendingChange } = require('../models');

exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      order: [['name', 'ASC']]
    });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCountry = async (req, res) => {
  try {
    // Create country with pending status
    const country = await Country.create({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record
    const pendingChange = await PendingChange.create({
      entityType: 'country',
      entityId: country.id,
      action: 'create',
      changeData: req.body,
      status: 'pending',
      requestedBy: req.user?.email || 'Current User'
    });

    res.status(201).json({
      message: 'Country created and pending approval',
      country,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Update country with pending status
    const oldData = country.toJSON();
    await country.update({
      ...req.body,
      approvalStatus: 'pending'
    });

    // Create approval record for update
    const pendingChange = await PendingChange.create({
      entityType: 'country',
      entityId: country.id,
      action: 'update',
      changeData: req.body,
      oldData: oldData,
      status: 'pending',
      requestedBy: req.user?.email || 'Current User'
    });

    res.json({
      message: 'Country update pending approval',
      country,
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    // Create approval record for deletion
    const pendingChange = await PendingChange.create({
      entityType: 'country',
      entityId: country.id,
      action: 'delete',
      changeData: {},
      oldData: country.toJSON(),
      status: 'pending',
      requestedBy: req.user?.email || 'Current User'
    });

    // Mark country as pending deletion
    await country.update({ approvalStatus: 'pending' });

    res.json({
      message: 'Country deletion pending approval',
      pendingChange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCountryHistory = async (req, res) => {
  try {
    const history = await PendingChange.findAll({
      where: {
        entityType: 'country',
        entityId: req.params.id
      },
      order: [['created_at', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
