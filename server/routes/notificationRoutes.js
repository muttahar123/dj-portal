import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMyNotifications);

router.route('/read-all')
    .put(markAllAsRead);

router.route('/:id/read')
    .put(markAsRead);

export default router;
