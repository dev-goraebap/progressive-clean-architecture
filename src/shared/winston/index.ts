import * as path from 'path';
import * as winston from 'winston';

export const winstonInstance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        // 콘솔에 로그 출력
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
        // Info 로그 파일 저장
        new winston.transports.File({
            filename: path.join('logs', 'info.log'),
            level: 'info',
        }),
        // Warning 로그 파일 저장
        new winston.transports.File({
            filename: path.join('logs', 'warning.log'),
            level: 'warn',
        }),
        // Error 로그 파일 저장
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
    ],
});