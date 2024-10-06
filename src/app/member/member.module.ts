import { Module } from "@nestjs/common";
import { LocalAuthService } from "./services/local-auth.service";

@Module({
    providers: [
        LocalAuthService
    ],
    exports: [
        LocalAuthService
    ]
})
export class MemberModule {}