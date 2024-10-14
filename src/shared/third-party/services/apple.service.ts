import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';

import * as fs from 'fs';
import { EnvConfig } from "src/shared/config";

import axios from "axios";
import { AuthorizedResult, OAuthProfile, OAuthProvider, OAuthProviders } from "../interfaces";

/**
 * Note:
 * API 문서 참고
 * https://developer.apple.com/documentation/sign_in_with_apple
 */
@Injectable()
export class AppleService implements OAuthProvider {

    private readonly logger = new Logger(AppleService.name);

    private readonly clientId: string;
    private readonly teamId: string;
    private readonly keyId: string;
    private readonly redirectUri: string;
    private readonly p8Path: string;

    /**
     * Note:
     * 애플은 다른 OAuth 공급자와 다르게 클라이언트 시크릿을 직접 생성해야함.
     * 때문에 만료시간이 끝나기 전까지는 캐시된 시크릿을 사용하도록 함
     */
    private cachedClientSecret: string | null = null;
    private clientSecretExpiration: number | null = null;

    constructor(
        private readonly configService: ConfigService<EnvConfig>,
    ) {
        this.clientId = this.configService.get('APPLE_CLIENT_ID');
        this.teamId = this.configService.get('APPLE_TEAM_ID');
        this.keyId = this.configService.get('APPLE_KEY_ID');
        this.redirectUri = this.configService.get('APPLE_REDIRECT_URI');
        this.p8Path = this.configService.get('APPLE_P8_PATH');
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

    async authorize(code: string): Promise<AuthorizedResult> {
        const headers = { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' };
        return await axios.post('https://appleid.apple.com/auth/token', {
            grant_type: 'authorization_code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            client_secret: this.createClientSecret(),
            code,
        }, { headers })
            .then(res => {
                const { access_token, id_token, expires_in } = res.data;
                const expiresAt = new Date(Date.now() + expires_in * 1000);
                return {
                    provider: OAuthProviders.APPLE,
                    accessToken: access_token,
                    idToken: id_token,
                    expiresAt,
                    errMsg: null
                } as AuthorizedResult;
            })
            .catch(err => {
                this.logger.log(JSON.stringify(err?.response?.data));
                const errResult = err?.response?.data;
                return {
                    provider: OAuthProviders.APPLE,
                    accessToken: null,
                    expiresAt: null,
                    errMsg: `[${errResult?.error}] 애플 인증 중 오류가 발생했습니다.`
                } as AuthorizedResult;
            });
    }

    async getProfile(idToken: string): Promise<OAuthProfile> {
        const payload: any = jwt.decode(idToken);
        this.logger.log(JSON.stringify(payload));
        return {
            id: payload?.sub,
            email: null,
            nickname: null,
            profileImageUrl: null
        } as OAuthProfile;
    }

    logout(token?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createClientSecret() {
        // 현재 시각
        const now = Math.floor(Date.now() / 1000);

        // 기존 클라이언트 시크릿이 있고 만료되지 않았다면, 캐시된 시크릿 반환
        if (this.cachedClientSecret && this.clientSecretExpiration && now < this.clientSecretExpiration) {
            this.logger.log('캐시된 시크릿 반환: ' + this.clientSecretExpiration);
            return this.cachedClientSecret;
        }

        // .p8 파일 읽기
        const privateKey = fs.readFileSync(this.p8Path, 'utf8');
        const exp = now + 15777000; // 6개월 후 만료 (Apple의 최대 허용 기간)

        // JWT 페이로드
        const payload = {
            iss: this.teamId,                   // 발급자: 팀 ID
            iat: now,                           // 발급 시간
            exp: exp,                           // 만료 시간
            aud: 'https://appleid.apple.com',   // 청중: Apple의 인증 서버
            sub: this.clientId                  // 주체: 클라이언트 ID (App ID 또는 Service ID)
        };

        // JWT 서명 및 생성
        const token = jwt.sign(payload, privateKey, {
            algorithm: 'ES256',                 // 서명 알고리즘
            header: {
                alg: 'ES256',
                kid: this.keyId,                // Key ID
                typ: 'JWT'
            }
        });

        // 클라이언트 시크릿 및 만료 시간 캐싱
        this.cachedClientSecret = token;
        this.clientSecretExpiration = exp;

        return token; // 생성된 JWT 반환
    }

}