import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { EnvConfig } from "src/shared/config";
import { AuthorizedResult, OAuthProfile, OAuthProvider, OAuthProviders } from "../interfaces";

@Injectable()
export class GoogleService implements OAuthProvider {

    private readonly logger = new Logger(GoogleService.name);

    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>,
    ) {
        this.clientId = this.configService.get('GOOGLE_CLIENT_ID');
        this.clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        this.redirectUri = this.configService.get('GOOGLE_REDIRECT_URI');
    }

    getLoginUrl(): string {
        const state = 'RANDOM_STATE';
        const scope = encodeURIComponent('email profile');
        const responseType = 'code';
        const accessType = 'offline';
        let url = 'https://accounts.google.com/o/oauth2/v2/auth?';
        url += `client_id=${this.clientId}`;
        url += `&redirect_uri=${this.redirectUri}`;
        url += `&response_type=${responseType}`;
        url += `&scope=${scope}`;
        url += `&state=${state}`;
        url += `&access_type=${accessType}`;
        return url;
    }

    async authorize(code: string): Promise<AuthorizedResult> {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', this.clientId);
        params.append('client_secret', this.clientSecret);
        params.append('redirect_uri', this.redirectUri);
        params.append('grant_type', 'authorization_code');

        // 구글에 토큰 요청
        return await axios.post('https://oauth2.googleapis.com/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(res => {
            const { access_token, expires_in } = res.data;
            const expiresAt = new Date(Date.now() + expires_in * 1000);
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: access_token,
                expiresAt,
                errMsg: null
            };
        }).catch(err => {
            this.logger.log(JSON.stringify(err?.response?.data));
            const errResult = err?.response?.data;
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: null,
                expiresAt: null,
                errMsg: `구글 인증 중 오류가 발생했습니다: ${errResult?.error_description}`
            };
        });
    }

    getProfile(token: string): Promise<OAuthProfile> {
        throw new Error("Method not implemented.");
    }

    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}