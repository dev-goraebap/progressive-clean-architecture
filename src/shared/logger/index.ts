import { utilities } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// DailyRotateFile 전송기 생성 함수
const createDailyRotateTransport = (level: string) => {
    return new (winston.transports as any).DailyRotateFile({
        level: level,
        dirname: path.join('logs'),
        filename: `${level}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        ),
    });
};

// Winston 인스턴스 생성
export const winstonInstance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike()
    ),
    transports: [
        // 콘솔에 로그 출력 (커스텀 형식)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // 콘솔에서 색상 적용
            ),
        }),
        // Info 로그 파일 저장 (날짜별 폴더)
        createDailyRotateTransport('info'),
        // Warning 로그 파일 저장 (날짜별 폴더)
        createDailyRotateTransport('warn'),
        // Error 로그 파일 저장 (날짜별 폴더)
        createDailyRotateTransport('error')
    ],
    exceptionHandlers: [
        // Error 로그 파일 저장 (날짜별 폴더)
        createDailyRotateTransport('exception'),
    ],
});
