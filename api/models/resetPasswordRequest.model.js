import mongoose from 'mongoose';

const expirationTimeSeconds = 60 * 10;

const resetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const ResetPassword = mongoose.model('ResetPassword', resetPasswordSchema);

export default ResetPassword;