import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    location: {
        type: Object, // Can use GeoJSON or other methods to store more detailed location data
        required: false
    },
    deviceInfo: {
        type: Object,
        required: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Automatically delete the session after 30 days
    },
    expiresAt: {
        type: Date,
        required: true
    },
    rememberMe: {
        type: Boolean,
        default: false
    }
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;