import Announcement from '../models/Announcement.js';
import { getIO } from '../socket.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private (All users)
export const getAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Admin only)
export const createAnnouncement = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const announcement = await Announcement.create(req.body);

        // Emit socket event to all connected clients
        const io = getIO();
        io.emit('new_announcement', {
            action: 'create',
            data: announcement
        });

        res.status(201).json({
            success: true,
            data: announcement
        });
    } catch (err) {
        next(err);
    }
};
