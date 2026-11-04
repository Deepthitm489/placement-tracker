const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  seedSampleApplications,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// All application routes are protected
router.use(protect);

router.route('/')
  .post(createApplication)
  .get(getApplications);

router.post('/seed-demo', seedSampleApplications);

router.route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
