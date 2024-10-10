import { Module } from "@nestjs/common";
import { MEMBER_REPOSITORY } from "./adapters";
import { LocalAuthService } from "./services/local-auth.service";

@Module({
    providers: [
        { provide: MEMBER_REPOSITORY, useValue: null },
        LocalAuthService
    ],
    exports: [
        LocalAuthService
    ]
})
export class MemberModule { }