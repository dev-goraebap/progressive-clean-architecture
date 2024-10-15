import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';
import { EnvConfig } from "../../config";
import { FcmNotifyDTO } from "../dto";

@Injectable()
export class FirebaseService {

    private readonly logger = new Logger(FirebaseService.name);

    readonly app: admin.app.App;
    readonly firestore: admin.firestore.Firestore;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        try {
            this.app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
                    privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
                    clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
                }),
            });
            this.logger.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin SDK', error);
        }
    }

    async notify(dto: FcmNotifyDTO) {
        // FCM 알림 요청 DTO 로그 출력
        this.logger.log(JSON.stringify(dto));

        // DTO에서 필요한 값을 구조 분해 할당
        const { fcmTokens, title, content, meta } = dto;

        // 토큰 배열을 500개씩 나눔
        const tokenChunks = this.tokenChunkArray(fcmTokens, 500);

        for (const tokenChunk of tokenChunks) {
            // FCM 메시지 생성
            const message: admin.messaging.MulticastMessage = {
                tokens: tokenChunk, // 청크로 나눈 토큰 배열
                android: {
                    priority: 'high', // Android 알림 우선순위 설정
                    notification: {
                        icon: 'https://avatars.githubusercontent.com/u/157282082?v=4', // 알림 아이콘 URL
                    }
                },
                notification: {
                    title, // 알림 제목
                    body: content, // 알림 내용
                },
                data: {
                    ...meta // 추가 데이터
                }
            };

            try {
                // FCM 메시지 전송
                const res = await this.app.messaging().sendEachForMulticast(message);
                this.logger.log(res); // 전송 결과 로그 출력
                return res;
            } catch (err) {
                // 에러 처리
                const errResult = err?.errorInfo;
                this.logger.error(errResult);
                throw new BadRequestException('FCM 알림 전송 중 오류가 발생했습니다.: ' + errResult?.code);
            }
        }
    }

    private tokenChunkArray(array: any[], chunkSize: number): string[][] {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }
}