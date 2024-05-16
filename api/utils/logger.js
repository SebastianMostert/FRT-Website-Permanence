import { format, createLogger, transports } from 'winston';
import Logs from '../models/logs.model.js';
const { combine, json, timestamp } = format;

// Configure the logger
export const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/errors/server.log', level: 'error' }),
        new transports.File({ filename: 'logs/errors/user.log', level: 'warn' }),
        new transports.File({ filename: 'logs/http.log', level: 'http' }),
        new transports.File({ filename: 'logs/complete.log' })
    ]
});

// Function to log actions
export function logServerError(message) {
    logger.error({ message, errorCode: 500 });
    // Update Logs
    saveToDB('server-error', { message });
}

export function logUserError(message, errorCode = 400) {
    logger.warn({ message, errorCode });
    // Update Logs
    saveToDB('user-error', { message, errorCode });
}

export function logUserAction(message, IP) {
    logger.info({ message, IP });
    // Update Logs
    saveToDB('action-log', { message, IP });
}

export function logHTTPRequest(endpoint, IP) {
    logger.http({ endpoint, IP });
    // Update Logs
    saveToDB('http-log', { endpoint, IP });
}

async function saveToDB(type, obj) {
    if (process.env.ENVIRONMENT != 'Prod') return;
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