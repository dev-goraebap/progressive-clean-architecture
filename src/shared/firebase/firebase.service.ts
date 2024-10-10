import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';
import { EnvConfig } from "../config";

@Injectable()
export class FirebaseService {

    private readonly logger = new Logger(FirebaseService.name);

    readonly firestore: admin.firestore.Firestore;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        try {
            const app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
                    privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
                    clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
                }),
            });
            this.firestore = app.firestore();
            this.logger.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin SDK', error);
        }
    }
}