import { Controller, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthService } from "src/app/member";

@Controller({ path: 'auth', version: '1' })
@ApiTags('사용자인증')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly localAuthService: LocalAuthService
    ) { }

    @Post()
    @ApiOperation({ summary: '일반회원가입' })
    async register() {
        const test = {
            username: 'test',
            password: 'test',
            email: 'test@test.com',
            phone: '010-1234-5678',
            name: '테스트',
        }
        Logger.log(JSON.stringify(test), 'context');
        Logger.warn('test', 'context');
        Logger.error('test 회원 생성 도중 에러가 발생하였습니다.');
        return await this.localAuthService.register('');
    }
}