import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

export type EnvConfig = {
    APP_HOST: string;
    APP_PORT: string;
    DISCORD_WEBHOOK_URL: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    KAKAO_CLIENT_ID: string;
    KAKAO_ADMIN_KEY: string;
    KAKAO_REDIRECT_URI: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    NAVER_REDIRECT_URI: string;
    NAVER_CLOUD_CLIENT_ID: string;
    NAVER_CLOUD_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    APPLE_CLIENT_ID: string;
    APPLE_TEAM_ID: string;
    APPLE_KEY_ID: string;
    APPLE_P8_PATH: string;
    APPLE_REDIRECT_URI: string;
    JUSOGO_KEY: string;
}

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`
        })
    ],
    exports: [
        ConfigModule
    ]
})
export class ConfigHelperModule {
    private readonly logger = new Logger(ConfigHelperModule.name);
    constructor() {
        this.logger.log(`[${process.env.NODE_ENV}] 환경으로 구동됩니다.`);
    }
}