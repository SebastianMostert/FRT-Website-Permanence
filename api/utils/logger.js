import { format, createLogger, transports } from 'winston';
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
}

export function logUserError(message, errorCode = 400) {
    logger.warn({ message, errorCode });
}

export function logUserAction(message, IP) {
    logger.info({ message, IP });
}

export function logHTTPRequest(endpoint, IP) {
    logger.http({ endpoint, IP });
}