import mongoose from 'mongoose';

const memberIAMSchema = new mongoose.Schema(
    {
        IAM: {
            type: String,
            required: true,
            unique: true,
        },
    },
);

const MemberIAM = mongoose.model('MemberIAM', memberIAMSchema);

export default MemberIAM;