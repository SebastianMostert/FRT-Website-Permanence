import mongoose from 'mongoose';

const removedExams = new mongoose.Schema(
    {
        IAM: {
            type: String,
            required: true,
            unique: true,
        },
        teachers: {
            type: [],
            required: true,
            default: [],
        },
        subjects: {
            type: [],
            required: true,
            default: [],
        },
        exams: {
            type: [],
            required: true,
            default: [],
        },
    },
);

const RemovedExams = mongoose.model('RemovedExams', removedExams);

export default RemovedExams;