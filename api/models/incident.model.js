import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    missionNumber: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
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
    }
});

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;