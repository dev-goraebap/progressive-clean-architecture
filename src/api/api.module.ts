import { Module } from "@nestjs/common";
import { MemberModule } from "src/app/member";
import { PolicyModule } from "src/app/policy";
import { AuthController } from "./controllers/auth.controller";
import { MemberController } from "./controllers/member.controller";

@Module({
    imports: [
        MemberModule,
        PolicyModule
    ],
    controllers: [
        MemberController,
        AuthController
    ],
})
export class ApiModule {}
