import { Global, Module } from "@nestjs/common";
import { AppleService, DiscordService, FirebaseService, GoogleService, JusogoService, KakaoService, NaverService } from "./services";

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
        JusogoService
    ],
    exports: [
        KakaoService,
        NaverService,
        GoogleService,
        AppleService,
        FirebaseService,
        DiscordService,
        JusogoService
    ]
})
export class ThirdPartyModule {}