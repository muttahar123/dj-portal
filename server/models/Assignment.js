import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    attachments: [String], // URLs to files in S3/Cloudinary
    points: {
        type: Number,
        default: 100
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

assignmentSchema.pre(/^find/, function () {
    this.where({ isDeleted: false });
});


export default mongoose.model('Assignment', assignmentSchema);

