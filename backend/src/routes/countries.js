const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { authenticate, canEdit, canDelete } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

router.get('/', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.get('/:id/history', countryController.getCountryHistory);
router.post('/', canEdit, countryController.createCountry);
router.put('/:id', canEdit, countryController.updateCountry);
router.delete('/:id', canDelete, countryController.deleteCountry);

module.exports = router;
