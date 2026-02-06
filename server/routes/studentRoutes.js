import express from 'express';
import { getAttendanceSummary, getAssignments, getEnrolledClasses } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('STUDENT', 'ADMIN'));

router.get('/attendance', getAttendanceSummary);
router.get('/assignments', getAssignments);
router.get('/classes', getEnrolledClasses);

export default router;
