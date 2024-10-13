import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";
import { randomBytes } from "crypto";
import { EnvConfig } from "src/shared/config";
import { AuthorizedResult, OAuthProfile, OAuthProvider, OAuthProviders } from "../interfaces";

@Injectable()
export class NaverService implements OAuthProvider {

    private readonly logger = new Logger(NaverService.name);

    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.clientId = this.configService.get('NAVER_CLIENT_ID');
        this.clientSecret = this.configService.get('NAVER_CLIENT_SECRET');
        this.redirectUri = this.configService.get('NAVER_REDIRECT_URI');
    }

    getLoginUrl(): string {
        let url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code';
        const state = randomBytes(16).toString('hex');
        url += `&client_id=${this.clientId}`;
        url += `&redirect_uri=${this.redirectUri}`;
        url += `&state=${state}`;
        return url;
    }

    async authorize(code: string): Promise<AuthorizedResult> {
        let apiURL = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code';
        apiURL += `&client_id=${this.clientId}`;
        apiURL += `&client_secret=${this.clientSecret}`;
        apiURL += `&redirect_uri=${this.redirectUri}`;
        apiURL += `&code=${code}`;

        return await axios.post(apiURL, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(res => {
            /**
             * Note:
             * 네이버는 인증에러시 정상 결과 값에 에러 데이터가 포함되어 있음.
             */
            this.logger.log(JSON.stringify(res.data));
            const { access_token, expires_in, error_description } = res.data;
            if (access_token) {
                const expiresAt = new Date(Date.now() + expires_in * 1000);
                return {
                    provider: OAuthProviders.NAVER,
                    accessToken: access_token,
                    expiresAt,
                    errMsg: null
                } as AuthorizedResult;
            } else {
                return {
                    provider: OAuthProviders.NAVER,
                    accessToken: null,
                    expiresAt: null,
                    errMsg: `네이버 인증 중 오류가 발생했습니다: ${error_description}`
                } as AuthorizedResult;
            }
        }).catch(_ => {
            return {
                provider: OAuthProviders.NAVER,
                accessToken: null,
                expiresAt: null,
                errMsg: '네이버 인증 중 오류가 발생했습니다.'
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