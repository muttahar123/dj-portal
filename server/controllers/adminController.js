import User from '../models/User.js';
import Class from '../models/Class.js';

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
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
export const updateUser = async (req, res, next) => {
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
export const createClass = async (req, res, next) => {
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
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find(req.query);
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

export const getAllClasses = async (req, res, next) => {
    try {
        const classes = await Class.find()
            .populate('teacher', 'name email department')
            .populate('students', 'name email');
        res.status(200).json({ success: true, count: classes.length, data: classes });
    } catch (err) {
        next(err);
    }
};

// @desc    Update class details
// @route   PUT /api/admin/classes/:id
// @access  Private/Admin
export const updateClass = async (req, res, next) => {
    try {
        const classToUpdate = await Class.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!classToUpdate) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Update students' classes array if students list is modified
        // This is a simplified version; for robust sync, we'd compare old vs new students
        if (req.body.students) {
            // Optional: Logic to remove this class from students who are no longer in the list
            // For now, we assume this operation sets the students list. 
            // A more complex implementation would diff the lists.
            await User.updateMany(
                { _id: { $in: req.body.students } },
                { $addToSet: { classes: classToUpdate._id } }
            );
        }

        res.status(200).json({ success: true, data: classToUpdate });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete class (Soft delete)
// @route   DELETE /api/admin/classes/:id
// @access  Private/Admin
export const deleteClass = async (req, res, next) => {
    try {
        const classToDelete = await Class.findById(req.params.id);

        if (!classToDelete) {
            return res.status(404).json({ message: 'Class not found' });
        }

        classToDelete.isDeleted = true;
        await classToDelete.save();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user (Soft delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isDeleted = true;
        await user.save();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

