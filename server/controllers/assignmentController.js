import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Class from '../models/Class.js';

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
export const createAssignment = async (req, res, next) => {
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
export const submitAssignment = async (req, res, next) => {
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
export const gradeSubmission = async (req, res, next) => {
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

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
export const getAssignments = async (req, res, next) => {
    try {
        let query = {};

        // If teacher, only show their assignments
        if (req.user.role === 'TEACHER') {
            query.teacher = req.user.id;
        }

        const assignments = await Assignment.find(query)
            .populate('class', 'name code')
            .populate('teacher', 'name')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (err) {
        next(err);
    }
};
// @desc    Get submissions for a specific assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
export const getSubmissionsByAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Verify teacher owns the assignment
        if (assignment.teacher.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Not authorized to view these submissions' });
        }

        const submissions = await AssignmentSubmission.find({ assignment: req.params.id })
            .populate('student', 'name email studentId')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        next(err);
    }
};
