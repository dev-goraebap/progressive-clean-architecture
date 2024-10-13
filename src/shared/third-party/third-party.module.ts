import { Global, Module } from "@nestjs/common";
import { DiscordService, FirebaseService, GoogleService, KakaoService, NaverService } from "./services";

@Global()
@Module({
    imports: [],
    providers: [
        KakaoService,
        NaverService,
        GoogleService,
        FirebaseService,
        DiscordService,
    ],
    exports: [
        KakaoService,
        NaverService,
        GoogleService,
        FirebaseService,
        DiscordService
    ]
})
export class ThirdPartyModule {}