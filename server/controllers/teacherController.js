import User from '../models/User.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';

// @desc    Get classes assigned to teacher
// @route   GET /api/teacher/classes
// @access  Private/Teacher
export const getAssignedClasses = async (req, res, next) => {
    try {
        const classes = await Class.find({ teacher: req.user.id });
        res.status(200).json({ success: true, count: classes.length, data: classes });
    } catch (err) {
        next(err);
    }
};

// @desc    Get students in a specific class
// @route   GET /api/teacher/classes/:classId/students
// @access  Private/Teacher
export const getClassStudents = async (req, res, next) => {
    try {
        const studentClass = await Class.findById(req.params.classId).populate('students', 'name email studentId department');

        if (!studentClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        res.status(200).json({ success: true, count: studentClass.students.length, data: studentClass.students });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark attendance for a class
// @route   POST /api/teacher/attendance
// @access  Private/Teacher
export const markAttendance = async (req, res, next) => {
    const { classId, date, records } = req.body; // records: [{ studentId: "...", status: "P/A/L" }]

    if (!classId || !date || !records) {
        return res.status(400).json({ message: 'Please provide classId, date, and records' });
    }

    try {
        // 1. Verify class belongs to teacher
        const studentClass = await Class.findOne({ _id: classId, teacher: req.user.id });
        if (!studentClass) {
            return res.status(401).json({ message: 'Not authorized to mark attendance for this class' });
        }

        // 2. Check for duplicate attendance
        const startOfDay = new Date(date).setHours(0, 0, 0, 0);
        const endOfDay = new Date(date).setHours(23, 59, 59, 999);

        const existing = await Attendance.findOne({
            class: classId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existing) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }

        // 3. Prepare bulk operations
        const attendanceData = records.map(record => ({
            class: classId,
            student: record.studentId,
            date: date,
            status: record.status,
            markedBy: req.user.id
        }));

        const results = await Attendance.insertMany(attendanceData);

        // 4. (Optional) Trigger Socket.IO updates here
        // io.to(`class:${classId}`).emit('ATTENDANCE_MARKED', { date, classId });

        res.status(201).json({ success: true, count: results.length, data: results });
    } catch (err) {
        next(err);
    }
};

// @desc    Update an existing attendance record
// @route   PUT /api/teacher/attendance/:id
// @access  Private/Teacher
export const updateAttendance = async (req, res, next) => {
    const { status } = req.body;

    if (!status || !['P', 'A', 'L'].includes(status)) {
        return res.status(400).json({ message: 'Please provide a valid status (P, A, or L)' });
    }

    try {
        const attendance = await Attendance.findById(req.params.id).populate('class');

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Verify class belongs to the requesting teacher
        if (attendance.class.teacher.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this attendance record' });
        }

        attendance.status = status;
        await attendance.save();

        res.status(200).json({ success: true, data: attendance });
    } catch (err) {
        next(err);
    }
};

// @desc    Get attendance for a class on a specific date
// @route   GET /api/teacher/attendance/:classId/:date
// @access  Private/Teacher
export const getAttendanceByDate = async (req, res, next) => {
    try {
        const { classId, date } = req.params;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.find({
            class: classId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('student', 'name email studentId');

        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (err) {
        next(err);
    }
};

