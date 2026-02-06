import express from 'express';
import {
    createAssignment,
    submitAssignment,
    gradeSubmission,
    getAssignments,
    getSubmissionsByAssignment
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAssignments)
    .post(authorize('TEACHER', 'ADMIN'), createAssignment);

router.get('/:id/submissions', authorize('TEACHER', 'ADMIN'), getSubmissionsByAssignment);
router.post('/:id/submit', authorize('STUDENT'), submitAssignment);
router.put('/grade/:submissionId', authorize('TEACHER', 'ADMIN'), gradeSubmission);

export default router;
