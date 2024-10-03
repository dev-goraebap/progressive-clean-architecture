import { Module } from "@nestjs/common";
import { MemberApiModule } from "src/api/member";
import { ConfigHelperModule } from "src/shared/config";

@Module({
    imports: [
        ConfigHelperModule,
        MemberApiModule
    ]
})
export class MainModule {}