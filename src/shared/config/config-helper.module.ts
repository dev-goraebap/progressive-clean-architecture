import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

export type EnvConfig = {
    DISCORD_WEBHOOK_URL: string;
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
    ]
})
export class ConfigHelperModule {
    private readonly logger = new Logger(ConfigHelperModule.name);
    constructor() {
        this.logger.log(`[${process.env.NODE_ENV}] 환경으로 구동됩니다.`);
    }
}