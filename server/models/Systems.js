import mongoose from 'mongoose';

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

export const Notification = mongoose.model('Notification', notificationSchema);
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
