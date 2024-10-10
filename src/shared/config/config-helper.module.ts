import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

export type EnvConfig = {
    DISCORD_WEBHOOK_URL: string;
    FIREBASE_TYPE: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_CLIENT_ID: string;
    FIREBASE_AUTH_URI: string;
    FIREBASE_TOKEN_URI: string;
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
    FIREBASE_CLIENT_X509_CERT_URL: string;
    FIREBASE_UNIVERSE_DOMAIN: string;
}

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validationSchema: Joi.object({
                DISCORD_WEBHOOK_URL: Joi.string().required(),
            })
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