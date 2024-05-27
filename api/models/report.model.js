import mongoose from 'mongoose';

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
        type: Object,
        required: true,
        default: {},
    },
    patientInfo: {
        age: {
            type: Number,
            default: 0,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            default: 'Other',
        },
        firstName: defaultStr,
        lastName: defaultStr,
        IAM: defaultStr,
        matricule: defaultStr,
    },
    abcdeSchema: {
        type: Object,
        required: true,
        default: {}
    },
    samplerSchema: {
        type: Object,
        required: true,
        default: {}
    },
    missionInfo: {
        type: Object,
        required: true,
        default: {}
    },
    missionInfo: {
        type: Object,
        required: true,
        default: {}
    },
    archived: {
        type: Boolean,
        default: false,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
