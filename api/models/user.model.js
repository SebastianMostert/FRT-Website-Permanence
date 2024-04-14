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
    },
    training: {
      type: [{
        type: String,
        enum: ['SAP 1', 'SAP 2', 'FIS 1', 'FIS 2'],
      }],
      required: true,
      default: [],
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
      unique: true,
    }, // Done
    verified: {
      type: Boolean,
      default: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    onBoarded: {
      type: Boolean,
      default: true,
      required: true,
    },
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    twoFactorAuthSecret: {
      type: String,
      default: '',
    },
    notifications: {
      securityEmails: {
        type: Boolean,
        default: true,
        required: true,
      },
      shiftEmails: {
        type: Boolean,
        default: true,
        required: true,
      },
      otherEmails: {
        type: Boolean,
        default: true,
        required: false,
      },
    },
    roles: {
      type: [{
        type: String,
        enum: ['admin', 'user', 'public'],
      }],
      default: ['user'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;