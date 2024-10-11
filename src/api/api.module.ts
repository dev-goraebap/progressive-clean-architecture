import { Module } from "@nestjs/common";
import { MemberModule } from "src/app/member";
import { PolicyModule } from "src/app/policy";
import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth.controller";
import { MemberController } from "./controllers/member.controller";
import { SocialController } from "./controllers/social.controller";

@Module({
    imports: [
        MemberModule,
        PolicyModule
    ],
    controllers: [
        AppController,
        MemberController,
        AuthController,
        SocialController
    ],
})
export class ApiModule {}
