import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "src/shared/config";

import { AuthorizedResult, OAuthProfile, OAuthProvider } from "../interfaces";

/**
 * Note:
 * API 문서 참고
 * https://developer.apple.com/documentation/sign_in_with_apple
 */
@Injectable()
export class AppleService implements OAuthProvider {

    private readonly clientId: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>,
    ) {
        this.clientId = this.configService.get('APPLE_CLIENT_ID');
        this.redirectUri = this.configService.get('APPLE_REDIRECT_URI');
    }

    getLoginUrl(): string {
        let scope = 'email name edu.users.read edu.classes.read';  // 요청할 스코프
        scope = encodeURIComponent(scope);  // 퍼센트 인코딩 처리
        const responseType = 'code';
        let url = 'https://appleid.apple.com/auth/authorize';
        url += `?client_id=${this.clientId}`;
        url += `&redirect_uri=${this.redirectUri}`;
        url += `&response_type=${responseType}`;
        return url;
    }

    authorize(code: string): Promise<AuthorizedResult> {
        throw new Error("Method not implemented.");
    }

    getProfile(token: string): Promise<OAuthProfile> {
        throw new Error("Method not implemented.");
    }

    logout(token?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}