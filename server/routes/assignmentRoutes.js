const express = require('express');
const { createAssignment, submitAssignment, gradeSubmission } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('TEACHER', 'ADMIN'), createAssignment);
router.post('/:id/submit', authorize('STUDENT'), submitAssignment);
router.put('/grade/:submissionId', authorize('TEACHER', 'ADMIN'), gradeSubmission);

module.exports = router;
