import { Controller, Post } from "@nestjs/common";
import { LocalAuthService } from "src/app/member";

@Controller({ path: 'auth', version: '1' })
export class AuthController {

    constructor(
        private readonly localAuthService: LocalAuthService
    ) { }

    @Post()
    async register() { 
        return await this.localAuthService.register('');
    }
}