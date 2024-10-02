import { Module } from "@nestjs/common";
import { MemberModule } from "src/app/member";
import { AuthController } from "./auth.controller";
import { MemberController } from "./member.controller";

@Module({
    imports: [
        MemberModule
    ],
    controllers: [
        MemberController,
        AuthController
    ],
})
export class MemberApiModule { }