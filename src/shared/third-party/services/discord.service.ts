import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { EnvConfig } from "src/shared/config";

@Injectable()
export class DiscordService {

    private readonly logger = new Logger(DiscordService.name);

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) { }

    async notify(logMessage: string) {
        const url = this.configService.get('DISCORD_WEBHOOK_URL');
        try {
            await axios.post(url, {
                content: `### 시스템 에러 발생\n${logMessage}`,
            });
        } catch (error) {
            this.logger.error('Failed to send log to Discord', error);
        }
    };
}