const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

// All dashboard routes require authentication
router.use(authenticate);

router.get('/statistics', dashboardController.getStatistics);

module.exports = router;
