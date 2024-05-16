import mongoose from 'mongoose';

const logsSchema = new mongoose.Schema({
    serverErrors: {
        type: Array,
        default: [],
    }, 
    clientErrors: {
        type: Array,
        default: [],
    },
    httpLogs: {
        type: Array,
        default: [],
    },
    actionLogs: {
        type: Array,
        default: [],
    }
});

const Logs = mongoose.model('Logs', logsSchema);

export default Logs;
