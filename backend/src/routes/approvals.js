const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { authenticate, canEdit } = require('../middleware/authMiddleware');

// All approval routes require authentication
router.use(authenticate);

// Read operations (all authenticated users can view)
router.get('/pending', approvalController.getPendingChanges);
router.get('/history', approvalController.getChangeHistory);

// Approve/reject operations (require edit permission - not Viewer)
router.post('/:id/approve', canEdit, approvalController.approveChange);
router.post('/:id/reject', canEdit, approvalController.rejectChange);

module.exports = router;
