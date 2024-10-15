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
        const { fcmTokens, title, content, meta } = dto;
        const token = fcmTokens.map(token => token).join(',');
        console.log(token);
        const message: admin.messaging.Message = {
            token,
            android: {
                priority: 'high'
            },
            notification: {
                title,
                body: content,
            },
            data: {
                ...meta
            }
        };

        try {
            const res = await this.app.messaging().send(message);
            console.log(res);
        } catch (err) {
            console.error(err);
            throw new BadRequestException('Failed to send FCM notification');
        }
    }
}