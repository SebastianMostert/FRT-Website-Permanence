import mongoose from 'mongoose';

const reqStr = {
    type: String,
    default: '',
};

const bool = {
    type: Boolean,
    default: false,
};

const defaultStr = {
    type: String,
    default: '',
};

const reportSchema = new mongoose.Schema({
    missionNumber: {
        type: Number,
        required: true,
    },
    firstResponders: {
        type: Array,
        default: [],
    },
    patientInfo: {
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
        },
        firstName: reqStr,
        lastName: reqStr,
        IAM: reqStr,
        otherInfo: reqStr,
    },
    abcdeSchema: {
        type: Object,
        required: true,
    },
    samplerSchema: {
        type: Object,
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;