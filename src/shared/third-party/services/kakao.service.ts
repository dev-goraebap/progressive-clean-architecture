import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

import { EnvConfig } from "src/shared/config";
import { AuthorizedResult, OAuthProfile, OAuthProvider, OAuthProviders } from "../interfaces";

@Injectable()
export class KakaoService implements OAuthProvider {

    private readonly logger = new Logger(KakaoService.name);

    private readonly clientId: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.clientId = this.configService.get('KAKAO_CLIENT_ID');
        this.redirectUri = this.configService.get('KAKAO_REDIRECT_URI');
    }

    getLoginUrl(): string {
        let url = 'https://kauth.kakao.com/oauth/authorize?'
        url += `client_id=${this.clientId}`
        url += `&redirect_uri=${this.redirectUri}`
        url += `&response_type=code`;
        return url;
    }

    async authorize(code: string): Promise<AuthorizedResult> {
        const headers = { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' };
        return await axios.post('https://kauth.kakao.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            code,
        }, { headers })
            .then(res => {
                const { access_token, expires_in } = res.data;
                const expiresAt = new Date(Date.now() + expires_in * 1000);
                return {
                    provider: OAuthProviders.KAKAO,
                    accessToken: access_token,
                    expiresAt,
                    errMsg: null
                } as AuthorizedResult;
            })
            .catch(err => {
                this.logger.log(JSON.stringify(err?.response?.data));
                const errResult = err?.response?.data;
                return {
                    provider: OAuthProviders.KAKAO,
                    accessToken: null,
                    expiresAt: null,
                    errMsg: `[${errResult?.error_code}] 카카오 인증 중 오류가 발생했습니다.`
                } as AuthorizedResult;
            });
    }

    getProfile(token: string): Promise<OAuthProfile> {
        throw new Error("Method not implemented.");
    }

    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}