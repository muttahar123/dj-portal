import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Class from '../models/Class.js';

// @desc    Get student attendance summary
// @route   GET /api/student/attendance
// @access  Private/Student
export const getAttendanceSummary = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ student: req.user.id })
            .populate('class', 'name code')
            .sort('-date');

        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get assignments for enrolled classes
// @route   GET /api/student/assignments
// @access  Private/Student
export const getAssignments = async (req, res, next) => {
    try {
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

// @desc    Get classes student is enrolled in
// @route   GET /api/student/classes
// @access  Private/Student
export const getEnrolledClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ students: req.user.id })
            .populate('teacher', 'name email');
        res.status(200).json({ success: true, count: classes.length, data: classes });
    } catch (err) {
        next(err);
    }
};
