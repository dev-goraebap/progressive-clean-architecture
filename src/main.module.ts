import { Module } from "@nestjs/common";

import { ApiModule } from "src/api";
import { ConfigHelperModule } from "src/shared/config";
import { MailModule } from "src/shared/mail";
import { ThirdPartyModule } from "./shared/third-party";

@Module({
    imports: [
        ConfigHelperModule,
        ThirdPartyModule,
        MailModule,
        ApiModule
    ]
})
export class MainModule {}