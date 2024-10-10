import { Module } from "@nestjs/common";
import { FirebaseMemberRepository } from "./adapters";
import { MEMBER_REPOSITORY } from "./adapters/interfaces";
import { LocalAuthService } from "./services/local-auth.service";

@Module({
    providers: [
        { provide: MEMBER_REPOSITORY, useClass: FirebaseMemberRepository },
        LocalAuthService
    ],
    exports: [
        LocalAuthService
    ]
})
export class MemberModule { }