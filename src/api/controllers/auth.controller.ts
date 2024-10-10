import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { LocalAuthService } from "src/app/member";
import { RegisterLocalMemberDTO } from "src/app/member/dto";
import { PolicyService } from "src/app/policy";

@Controller({ path: 'auth', version: '1' })
@ApiTags('사용자인증')
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly localAuthService: LocalAuthService,
        private readonly policyService: PolicyService
    ) { }

    @Post()
    @ApiOperation({ summary: '일반회원가입' })
    async register(@Body() dto: RegisterLocalMemberDTO) {
        await this.policyService.validates(dto.policyIds);
        return await this.localAuthService.register(dto);
    }
}