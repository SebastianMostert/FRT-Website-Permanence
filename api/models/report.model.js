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
        type: Array,
        required: true,
        default: [],
    },
    patientInfo: {
        age: {
            type: Number,
            required: true,
            default: 0,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true,
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
    archived: {
        type: Boolean,
        default: false,
        default: {}
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;