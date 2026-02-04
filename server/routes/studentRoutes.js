const express = require('express');
const { getAttendanceSummary, getAssignments } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('STUDENT', 'ADMIN'));

router.get('/attendance', getAttendanceSummary);
router.get('/assignments', getAssignments);

module.exports = router;
