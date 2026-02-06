import mongoose from 'mongoose';

// Announcement Model
const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['global', 'class'], default: 'global' },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // Null if global
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

// Notification Model
const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['assignment', 'grade', 'attendance', 'announcement'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: String
}, { timestamps: true });

// AuditLog Model
const auditLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    ip: String,
    userAgent: String,
    targetId: mongoose.Schema.Types.ObjectId,
    changes: Object
}, { timestamps: true });

auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

export const Announcement = mongoose.model('Announcement', announcementSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

