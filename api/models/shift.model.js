import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    shifts: [
        {
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
            selected: {
                type: Boolean,
                default: true,
            },
            availabilityId: {
                type: String,
                required: true,
            },
            operationalPosition: {
                type: String,
                required: true,
            },
            startDate: {
                type: Date,
                required: true,
            },
            endDate: {
                type: Date,
                required: true,
            },
        },
    ],
});

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
