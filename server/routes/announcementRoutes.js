import express from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAnnouncements)
    .post(authorize('ADMIN'), createAnnouncement);

export default router;
