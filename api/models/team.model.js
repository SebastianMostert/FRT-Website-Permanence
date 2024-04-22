import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        members: {
            type: [],
            required: true,
            default: [],
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
    },
);

const Team = mongoose.model('Team', teamSchema);

export default Team;