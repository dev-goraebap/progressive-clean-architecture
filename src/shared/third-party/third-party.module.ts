import { Global, Module } from "@nestjs/common";
import { AppleService, DiscordService, FirebaseService, GoogleService, KakaoService, NaverService } from "./services";

@Global()
@Module({
    imports: [],
    providers: [
        KakaoService,
        NaverService,
        GoogleService,
        AppleService,
        FirebaseService,
        DiscordService,
    ],
    exports: [
        KakaoService,
        NaverService,
        GoogleService,
        AppleService,
        FirebaseService,
        DiscordService
    ]
})
export class ThirdPartyModule {}