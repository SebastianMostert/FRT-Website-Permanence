import { logServerError, logHTTPRequest, logUserError } from "../utils/logger.js";
import Logs from "../models/logs.model.js";
import { errorHandler } from '../utils/error.js';
import fs from 'fs';
import path from "path";

const dir = path.resolve();
const logsDirectory = path.join(dir, 'logs');

// Fetch all audits
export const fetchAllAudits = async (req, res, next) => {
    logHTTPRequest('/audit/fetch', req.ip);
    try {
        const { origin } = req.body;

        if (!origin) {
            logUserError({
                IP: req.ip,
                message: 'Fetch audits failed: Origin is required',
                errorCode: 400,
            })
            return res.status(400).json({ message: 'Origin is required' });
        }

        if (origin == 'log-files') {
            // Fetch from log files located in /logs folder
            // Fetch all .log files in /logs folder and sub-folders
            // Read each file and add its content to the logs array
            const { allLogs, serverErrors, clientErrors, httpLogs, actionLogs } = readLogFiles(logsDirectory);
            return res.status(200).json({
                allLogs: allLogs,
                serverErrors: serverErrors,
                clientErrors: clientErrors,
                httpLogs: httpLogs,
                actionLogs: actionLogs,
            });
        } else if (origin == 'database') {
            // Fetch from database
            const logs = await Logs.find();
            if (!logs) {
                logUserError({
                    IP: req.ip,
                    message: 'Fetch audits failed: No logs found',
                    errorCode: 404,
                })
                return res.status(404).json({ message: 'No logs found' });
            } else {
                const logObj = logs[0];

                if (!logObj) {
                    logUserError({
                        IP: req.ip,
                        message: 'Fetch audits failed: No logs found',
                        errorCode: 404,
                    })
                    return res.status(404).json({ message: 'No logs found' });
                }

                const serverErrors = logObj.serverErrors;
                const clientErrors = logObj.clientErrors;
                const httpLogs = logObj.httpLogs;
                const actionLogs = logObj.actionLogs;
                return res.status(200).json({
                    serverErrors,
                    clientErrors,
                    httpLogs,
                    actionLogs,
                    allLogs: [...serverErrors, ...clientErrors, ...httpLogs, ...actionLogs],
                });
            }
        } else {
            logUserError({
                IP: req.ip,
                message: 'Fetch audits failed: Invalid origin',
                errorCode: 400,
            })
            return res.status(400).json({ message: 'Invalid origin' });
        }
    } catch (error) {
        logServerError(error.message);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

function readLogFiles(dir, allLogs = [], serverErrors = [], clientErrors = [], httpLogs = [], actionLogs = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readLogFiles(filePath, allLogs, serverErrors, clientErrors, httpLogs, actionLogs);
        } else if (stat.isFile() && path.extname(file) === '.log') {
            const content = fs.readFileSync(filePath, 'utf8');
            if (file.includes('server')) {
                serverErrors.push(...formatString(content, 'server-error'));
            } else if (file.includes('user')) {
                clientErrors.push(...formatString(content, 'client-error'));
            } else if (file.includes('http')) {
                httpLogs.push(...formatString(content, 'http'));
                actionLogs.push(...formatString(content, 'info'));
            }
            allLogs.push(...formatString(content, 'all'));
        }
    });

    return { allLogs, serverErrors, clientErrors, httpLogs, actionLogs };
}

function formatString(str, expectedType) {
    const arr = str.split('\r\n');

    // Find and remove empty strings
    arr.splice(arr.indexOf(''), 1);

    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        const obj = JSON.parse(element);

        // We only care about the stuff in the message object
        const msgObj = obj.message;

        // Get the type of log
        const type = obj.level;

        if (expectedType == 'server-error' && msgObj.errorCode >= 500) newArr.push(msgObj);
        else if (expectedType == 'client-error' && msgObj.errorCode >= 400 && msgObj.errorCode < 500) newArr.push(msgObj);
        else if (type == expectedType) newArr.push(msgObj);
        else if (expectedType == 'all') newArr.push(msgObj);
    }

    return newArr;
}