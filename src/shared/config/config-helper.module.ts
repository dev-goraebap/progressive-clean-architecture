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
    KAKAO_REDIRECT_URI: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    NAVER_REDIRECT_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    APPLE_CLIENT_ID: string;
    APPLE_CLIENT_SECRET: string;
    APPLE_REDIRECT_URI: string;
}

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            // validationSchema: Joi.object({
            //     APP_PORT: Joi.string().required(),
            //     DISCORD_WEBHOOK_URL: Joi.string().required(),
            //     FIREBASE_PROJECT_ID: Joi.string().required(),
            //     FIREBASE_PRIVATE_KEY: Joi.string().required(),
            //     FIREBASE_CLIENT_EMAIL: Joi.string().required(),
            //     KAKAO_CLIENT_ID: Joi.string().required(),
            //     KAKAO_REDIRECT_URI: Joi.string().required(),
            //     NAVER_CLIENT_ID: Joi.string().required(),
            //     NAVER_CLIENT_SECRET: Joi.string().required(),
            //     NAVER_REDIRECT_URI: Joi.string().required(),
            //     GOOGLE_CLIENT_ID: Joi.string().required(),
            //     GOOGLE_CLIENT_SECRET: Joi.string().required(),
            //     GOOGLE_REDIRECT_URI: Joi.string().required(),
            //     APPLE_CLIENT_ID: Joi.string().required(),
            //     APPLE_CLIENT_SECRET: Joi.string().required(),
            //     APPLE_REDIRECT_URI: Joi.string().required(),
            // })
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