import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosHeaders } from "axios";

import { EnvConfig } from "src/shared/config";
import { AuthorizedResult, OAuthProfile, OAuthProvider, OAuthProviders } from "../interfaces";

/**
 * Note:
 * API 문서 참고
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
 */
@Injectable()
export class KakaoService implements OAuthProvider {

    private readonly logger = new Logger(KakaoService.name);

    private readonly clientId: string;
    private readonly adminKey: string;
    private readonly redirectUri: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.clientId = this.configService.get('KAKAO_CLIENT_ID');
        this.redirectUri = this.configService.get('KAKAO_REDIRECT_URI');
        this.adminKey = this.configService.get('KAKAO_ADMIN_KEY');
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

    async getProfile(token: string): Promise<OAuthProfile> {
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${token}`);
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8');

        const res = await axios.post('https://kapi.kakao.com/v2/user/me', null, { headers })
            .catch(err => {
                const errResult = err?.response?.data;
                this.logger.log(JSON.stringify(errResult));
                throw new BadRequestException(`카카오 프로필 조회 중 오류가 발생했습니다: ${errResult?.msg}`);
            });
        this.logger.log(JSON.stringify(res.data));
        const { id } = res.data;
        return {
            id,
            email: null,
            nickname: null,
            profileImageUrl: null
        };
    }

    async logout(): Promise<void> {
        // 3743400481
        // 3743400481
        console.log(this.adminKey);

        const headers = new AxiosHeaders();
        headers.setAuthorization(`KakaoAK ${this.adminKey}`);
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8');

        const params = new URLSearchParams();
        params.append('target_id_type', 'user_id');
        params.append('target_id', '3743400481');

        await axios.post('https://kapi.kakao.com/v1/user/unlink', params.toString(), { headers })
            .catch(err => {
                const errResult = err?.response?.data;
                this.logger.log(JSON.stringify(errResult));
                throw new BadRequestException(`카카오 로그아웃 중 오류가 발생했습니다: ${errResult?.msg}`);
            });
    }
}