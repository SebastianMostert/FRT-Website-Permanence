import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    }, // Done
    lastName: {
      type: String,
      required: true,
    }, // Done
    IAM: {
      type: String,
      required: true,
      unique: true,
    }, // Done
    studentClass: {
      type: String,
      required: true,
      default: 'None',
    }, // Done
    password: {
      type: String,
      required: true,
    }, // Done
    profilePicture: {
      type: String,
      default:
        'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    }, // Done
    training: {
      type: [{
        type: String,
        enum: ['SAP 1', 'SAP 2', 'FIS 1', 'FIS 2'],
      }],
      required: true,
      default: [],
    }, // Done
    llisPosition: {
      type: String,
      enum: ['Student', 'Teacher', 'SEPAS'],
      required: true,
      default: 'Student',
    },
    experience: {
      RTW: {
        type: Number,
        required: true,
        default: 0,
      }, // Done
      FR: {
        type: Number,
        required: true,
        default: 0,
      }
    }, // Done
    firstAidCourse: {
      type: Boolean,
      default: false,
    },
    operationalPosition: {
      type: String,
      enum: ['Chef Agres', 'Equipier Bin.', 'Stagiaire Bin.', 'None'],
      required: true,
      default: 'None',
    },
    administratifPosition: {
      type: String,
      enum: ['Sergeant Chef', 'Sergeant', 'Chef de Service Asatzstruktur', 'Chef de Service Rekrutement', 'Chef de Service StoRa', 'None'],
      required: true,
      default: 'None',
    },
    email: {
      type: String,
      required: true,
    }, // Done
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;