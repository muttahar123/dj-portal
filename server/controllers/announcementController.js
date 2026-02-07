import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import { Notification } from '../models/Systems.js';
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

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private (All users)
export const getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'name');

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        res.status(200).json({
            success: true,
            data: announcement
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

        // Create notifications for all users
        const allUsers = await User.find({ _id: { $ne: req.user.id } }).select('_id');
        const notifications = allUsers.map(user => ({
            recipient: user._id,
            type: 'announcement',
            message: `New Announcement: ${announcement.title}`,
            link: `/dashboard/announcements`
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        // Emit socket event to all connected clients
        const io = getIO();
        io.emit('new_announcement', {
            action: 'create',
            data: announcement
        });

        // Emit notification event
        io.emit('new_notification', {
            message: `New Announcement: ${announcement.title}`,
            type: 'announcement'
        });

        res.status(201).json({
            success: true,
            data: announcement
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin only)
export const updateAnnouncement = async (req, res, next) => {
    try {
        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: announcement
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin only)
export const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found' });
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
