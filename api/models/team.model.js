import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    minMembers: {
        type: Number,
        required: true,
    },
    maxMembers: {
        type: Number,
        required: true,
    },
    memberPositions: {
        type: [],
        required: true,
        default: [],
    },
    members: {
        type: [],
        required: true,
        default: [],
    },
    phoneRequired: {
        type: Boolean,
        required: true,
        default: false,
    },
    keyRequired: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: String,
        required: true,
        default: 6,
    },
    alerted: {
        type: Boolean,
        required: true,
        default: false,
    },
    startDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    endDate: {
        type: Date,
        required: true,
        default: new Date(),
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
});

const Team = mongoose.model('Team', teamSchema);

export default Team;