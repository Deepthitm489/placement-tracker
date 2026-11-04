const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentApplications,
  getUpcomingInterviews,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All dashboard routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentApplications);
router.get('/interviews', getUpcomingInterviews);

module.exports = router;
