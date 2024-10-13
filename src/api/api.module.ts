import { Module } from "@nestjs/common";
import { MemberModule } from "src/app/member";
import { PolicyModule } from "src/app/policy";
import { ThirdPartyController } from "src/shared/third-party";
import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth.controller";
import { MemberController } from "./controllers/member.controller";

@Module({
    imports: [
        MemberModule,
        PolicyModule
    ],
    controllers: [
        AppController,
        ThirdPartyController,
        MemberController,
        AuthController,
    ],
})
export class ApiModule {}
