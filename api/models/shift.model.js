import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    users: [{
        IAM: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        teamID: {
            type: String,
            required: true,
        },
    }]
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
