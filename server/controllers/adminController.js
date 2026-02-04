const User = require('../models/User');
const Class = require('../models/Class');

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role, department, studentId, teacherId } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            studentId,
            teacherId
        });

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new class
// @route   POST /api/admin/classes
// @access  Private/Admin
exports.createClass = async (req, res, next) => {
    try {
        const { name, code, teacher, students, schedule } = req.body;

        const newClass = await Class.create({
            name,
            code,
            teacher,
            students,
            schedule
        });

        // Update teacher's classes array
        await User.findByIdAndUpdate(teacher, { $addToSet: { classes: newClass._id } });

        // Update students' classes array
        if (students && students.length > 0) {
            await User.updateMany(
                { _id: { $in: students } },
                { $addToSet: { classes: newClass._id } }
            );
        }

        res.status(201).json({ success: true, data: newClass });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users (with filters)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find(req.query);
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};
