import { Module } from "@nestjs/common";
import { MemberApiModule } from "src/api/member";

@Module({
    imports: [
        MemberApiModule
    ]
})
export class MainModule {}