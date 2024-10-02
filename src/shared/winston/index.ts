import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { sendErrorToDiscord } from './send-error-to-discord';

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
            winston.format.json()
        ),
    });
};

// Winston 트랜스포트에서 에러 로그를 기록하고, 에러 발생 시 비동기로 Discord 알림을 전송하는 트랜스포트
const discordTransport = new winston.transports.Console({
    level: 'error',  // 에러 레벨에서만 동작
    format: winston.format.printf(({ message }) => {
        // Discord로 비동기 전송 (비동기로 처리)
        sendErrorToDiscord(message);
        return '디스코드 에러 알림 전송 완료';
    }),
});

// Winston 인스턴스 생성
export const winstonInstance = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
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
        createDailyRotateTransport('error'),
        discordTransport
    ],
    exceptionHandlers: [
        // Error 로그 파일 저장 (날짜별 폴더)
        createDailyRotateTransport('exception'),
    ],
});
