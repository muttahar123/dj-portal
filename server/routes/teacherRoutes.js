const express = require('express');
const { getAssignedClasses, getClassStudents, markAttendance } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('TEACHER', 'ADMIN'));

router.get('/classes', getAssignedClasses);
router.get('/classes/:classId/students', getClassStudents);
router.post('/attendance', markAttendance);

module.exports = router;
