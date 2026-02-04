const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Class = require('../models/Class');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
exports.createAssignment = async (req, res, next) => {
    try {
        const { title, description, classId, dueDate, points } = req.body;

        // Verify class belongs to teacher
        const studentClass = await Class.findOne({ _id: classId, teacher: req.user.id });
        if (!studentClass) {
            return res.status(401).json({ message: 'Not authorized for this class' });
        }

        const assignment = await Assignment.create({
            title,
            description,
            class: classId,
            teacher: req.user.id,
            dueDate,
            points
        });

        res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res, next) => {
    try {
        const { fileUrl } = req.body; // In practice, file would be uploaded via multer first

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if deadline passed
        if (new Date() > new Date(assignment.dueDate)) {
            // Logic for late submission could go here
        }

        const submission = await AssignmentSubmission.create({
            assignment: req.params.id,
            student: req.user.id,
            fileUrl
        });

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/grade/:submissionId
// @access  Private/Teacher
exports.gradeSubmission = async (req, res, next) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await AssignmentSubmission.findById(req.params.submissionId)
            .populate('assignment');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Verify teacher owns the assignment
        if (submission.assignment.teacher.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to grade this submission' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';

        await submission.save();

        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};
