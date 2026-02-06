import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['P', 'A', 'L'], // Present, Absent, Late
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Compound index for fast retrieval of daily attendance for a class
attendanceSchema.index({ class: 1, date: 1 });
// Index for student-specific attendance tracking
attendanceSchema.index({ student: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);

