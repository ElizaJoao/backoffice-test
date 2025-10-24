const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, canEdit, canDelete } = require('../middleware/authMiddleware');

// All company routes require authentication
router.use(authenticate);

// Read operations (all authenticated users can view)
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);
router.get('/:id/history', companyController.getCompanyHistory);

// Write operations (require edit permission - not Viewer)
router.post('/', canEdit, companyController.createCompany);
router.put('/:id', canEdit, companyController.updateCompany);

// Delete operations (Admin only)
router.delete('/:id', canDelete, companyController.deleteCompany);

module.exports = router;
