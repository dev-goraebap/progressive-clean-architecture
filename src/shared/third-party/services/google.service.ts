import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosHeaders } from "axios";
import { EnvConfig } from "src/shared/config";
import { OAuthAuthorizedViewModel, OAuthProfileViewModel } from "../core/models";
import { OAuthProviders } from "../core/types";
import { OAuthProvider } from "../interfaces";

/**
 * Note:
 * API 문서 참고
 * https://developers.google.com/identity/openid-connect/openid-connect?hl=ko#authenticatingtheuser
 * https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
 */
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

    oauthGetLoginUrl(): string {
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

    async oauthAuthorize(code: string): Promise<OAuthAuthorizedViewModel> {
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
            console.log(expires_in);
            const expiresAt = new Date(Date.now() + expires_in * 1000);
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: access_token,
                idToken: null,
                expiresAt,
                errMsg: null
            };
        }).catch(err => {
            this.logger.log(JSON.stringify(err?.response?.data));
            const errResult = err?.response?.data;
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: null,
                idToken: null,
                expiresAt: null,
                errMsg: `구글 인증 중 오류가 발생했습니다: ${errResult?.error_description}`
            };
        });
    }

    async oauthGetProfile(token: string): Promise<OAuthProfileViewModel> {
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${token}`);
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8');

        const res = await axios.post('https://www.googleapis.com/oauth2/v3/userinfo', null, { headers })
            .catch(err => {
                const errResult = err?.response?.data;
                this.logger.log(JSON.stringify(errResult));
                throw new BadRequestException(`구글 프로필 조회 중 오류가 발생했습니다: ${errResult?.msg}`);
            });
        this.logger.log(JSON.stringify(res.data));

        const { sub, name, picture, email } = res.data;
        return {
            id: sub,
            email,
            nickname: name,
            profileImageUrl: picture
        };
    }
}