const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, canEdit, canDelete } = require('../middleware/authMiddleware');

// All employee routes require authentication
router.use(authenticate);

// Read operations (all authenticated users can view)
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.get('/:id/history', employeeController.getEmployeeHistory);

// Write operations (require edit permission - not Viewer)
router.post('/', canEdit, employeeController.createEmployee);
router.put('/:id', canEdit, employeeController.updateEmployee);

// Delete operations (Admin only)
router.delete('/:id', canDelete, employeeController.deleteEmployee);

module.exports = router;
