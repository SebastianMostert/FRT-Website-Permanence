import { format, createLogger, transports } from 'winston';
import Logs from '../models/logs.model.js';
const { combine, json, timestamp } = format;

// Configure the logger
export const logger = createLogger({
    level: 'info',
    format: combine(
        json()
    ),
    transports: [
        new transports.File({ filename: 'logs/errors-server.log', level: 'error' }),
        new transports.File({ filename: 'logs/errors-user.log', level: 'warn' }),
        new transports.File({ filename: 'logs/http.log', level: 'http' }),
    ]
});

// Function to log actions
export function logServerError(message) {
    const timestamp = new Date();
    const obj = { msg: message, errorCode: 500, timestamp }
    logger.error(obj);
    // Update Logs
    saveToDB('server-error', obj);
}

export function logUserError({ message, errorCode = 400, IAM = 'N/A', userID = 'N/A', IP }) {
    const timestamp = new Date();
    const obj = { msg: message, errorCode, IP, IAM, userID, timestamp }
    logger.warn(obj);
    // Update Logs
    saveToDB('user-error', obj);
}

export function logUserAction({ message, IP, IAM = 'N/A', userID = 'N/A' }) {
    const timestamp = new Date();
    const obj = { msg: message, IP, IAM, userID, timestamp }
    logger.info(obj);
    // Update Logs
    saveToDB('action-log', obj);
}

export function logHTTPRequest(endpoint, IP) {
    const timestamp = new Date();
    const obj = { endpoint, IP, timestamp }
    logger.http(obj);
    // Update Logs
    saveToDB('http-log', obj);
}

async function saveToDB(type, obj) {
    if (process.env.ENVIRONMENT != 'prod') return;
    const logs = await Logs.find();
    let firstLog = logs[0];

    if (!firstLog) {
        firstLog = new Logs({
            serverErrors: [],
            clientErrors: [],
            httpLogs: [],
            actionLogs: []
        });
    }

    switch (type) {
        case 'server-error':
            await firstLog.updateOne({ serverErrors: [...firstLog.serverErrors, obj] });
            break;

        case 'client-error':
            await firstLog.updateOne({ clientErrors: [...firstLog.clientErrors, obj] });
            break;

        case 'http-log':
            await firstLog.updateOne({ httpLogs: [...firstLog.httpLogs, obj] });
            break;

        case 'action-log':
            await firstLog.updateOne({ actionLogs: [...firstLog.actionLogs, obj] });
            break;
        default:
            break;
    }

    await firstLog.save();
}