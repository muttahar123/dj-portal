import express from 'express';
import { getAssignedClasses, getClassStudents, markAttendance } from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('TEACHER', 'ADMIN'));

router.get('/classes', getAssignedClasses);
router.get('/classes/:classId/students', getClassStudents);
router.post('/attendance', markAttendance);

export default router;

