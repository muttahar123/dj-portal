const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');

// @desc    Get student attendance summary
// @route   GET /api/student/attendance
// @access  Private/Student
exports.getAttendanceSummary = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ student: req.user.id })
            .populate('class', 'name code')
            .sort('-date');

        // Logic to calculate percentages per subject could go here

        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get assignments for enrolled classes
// @route   GET /api/student/assignments
// @access  Private/Student
exports.getAssignments = async (req, res, next) => {
    try {
        // Find classes the student is in
        const enrolledClasses = await Class.find({ students: req.user.id });
        const classIds = enrolledClasses.map(c => c._id);

        const assignments = await Assignment.find({ class: { $in: classIds } })
            .populate('class', 'name code')
            .populate('teacher', 'name')
            .sort('-dueDate');

        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (err) {
        next(err);
    }
};
