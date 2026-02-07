import express from 'express';
import {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAnnouncements)
    .post(authorize('ADMIN'), createAnnouncement);

router.route('/:id')
    .get(getAnnouncement)
    .put(authorize('ADMIN'), updateAnnouncement)
    .delete(authorize('ADMIN'), deleteAnnouncement);

export default router;
