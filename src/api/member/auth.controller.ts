import { Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthService } from "src/app/member";

@Controller({ path: 'auth', version: '1' })
@ApiTags('사용자인증')
export class AuthController {

    constructor(
        private readonly localAuthService: LocalAuthService
    ) { }

    @Post()
    @ApiOperation({ summary: '일반회원가입' })
    async register() {
        return await this.localAuthService.register('');
    }
}