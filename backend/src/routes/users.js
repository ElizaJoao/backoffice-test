const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, canEdit, canDelete } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(authenticate);

// Read operations (all authenticated users can view)
router.get('/', userController.getAllUsers);
router.get('/roles', userController.getRoles);
router.get('/:id', userController.getUserById);
router.get('/:id/history', userController.getUserHistory);

// Write operations (require edit permission - not Viewer)
router.post('/', canEdit, userController.createUser);
router.put('/:id', canEdit, userController.updateUser);

// Delete operations (Admin only)
router.delete('/:id', canDelete, userController.deleteUser);

module.exports = router;
