import { Controller, Get, Render } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { EnvConfig } from "src/shared/config";

@Controller()
@ApiTags('앱')
export class AppController {

    constructor(
        private readonly configService: ConfigService<EnvConfig>,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Health Check' })
    @Render('social-request')
    healthy() {
        const host = this.configService.get('APP_HOST');
        const kakaoClientId = this.configService.get('KAKAO_CLIENT_ID');
        return { host: host, kakaoClientId };
    }
}