import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
    {
        IAM: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        confirmed: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
);

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;