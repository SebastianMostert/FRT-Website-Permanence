import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    missionNumber: {
        type: Number,
        required: true,
    },
    teamId: {
        type: String,
        required: true,
    },
    incidentInfo: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    ambulanceCalled: {
        type: Boolean,
        required: true,
    },
    urgenceLevel: {
        type: Number,
        required: true,
        default: 4,
    },
    resolved: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;