import { Module } from "@nestjs/common";

import { ApiModule } from "src/api";
import { ConfigHelperModule } from "src/shared/config";
import { FirebaseModule } from "src/shared/firebase";
import { MailModule } from "src/shared/mail";

@Module({
    imports: [
        ConfigHelperModule,
        MailModule,
        FirebaseModule,
        ApiModule
    ]
})
export class MainModule {}