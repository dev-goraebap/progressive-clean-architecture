import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios, { AxiosHeaders } from "axios";
import { randomBytes } from "crypto";
import { EnvConfig } from "src/shared/config";
import { NaverDrivePathsViewModel, NaverPlaceViewModel, OAuthAuthorizedViewModel, OAuthProfileViewModel } from "../core/models";
import { OAuthProviders } from "../core/types";
import { FetchNaverDrivePathDTO, FetchNaverPlaceDTO } from "../dto";
import { OAuthProvider } from "../interfaces";

/**
 * Note:
 * API 문서 참고
 * https://developers.naver.com/docs/login/api/api.md
 */
@Injectable()
export class NaverService implements OAuthProvider {

    private readonly logger = new Logger(NaverService.name);

    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly redirectUri: string;
    private readonly cloudClientId: string;
    private readonly cloudClientSecret: string;

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) {
        this.clientId = this.configService.get('NAVER_CLIENT_ID');
        this.clientSecret = this.configService.get('NAVER_CLIENT_SECRET');
        this.redirectUri = this.configService.get('NAVER_REDIRECT_URI');
        this.cloudClientId = this.configService.get('NAVER_CLOUD_CLIENT_ID');
        this.cloudClientSecret = this.configService.get('NAVER_CLOUD_CLIENT_SECRET');
    }

    oauthGetLoginUrl(): string {
        let url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code';
        const state = randomBytes(16).toString('hex');
        url += `&client_id=${this.clientId}`;
        url += `&redirect_uri=${this.redirectUri}`;
        url += `&state=${state}`;
        return url;
    }

    async oauthAuthorize(code: string): Promise<OAuthAuthorizedViewModel> {
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
                    idToken: null,
                    expiresAt,
                    errMsg: null
                } as OAuthAuthorizedViewModel;
            } else {
                return {
                    provider: OAuthProviders.NAVER,
                    accessToken: null,
                    idToken: null,
                    expiresAt: null,
                    errMsg: `네이버 인증 중 오류가 발생했습니다: ${error_description}`
                } as OAuthAuthorizedViewModel;
            }
        }).catch(_ => {
            return {
                provider: OAuthProviders.NAVER,
                accessToken: null,
                expiresAt: null,
                errMsg: '네이버 인증 중 오류가 발생했습니다.'
            } as OAuthAuthorizedViewModel;
        });
    }

    async oauthGetProfile(token: string): Promise<OAuthProfileViewModel> {
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${token}`);
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8');

        const res = await axios.post('https://openapi.naver.com/v1/nid/me', null, { headers })
            .catch(err => {
                const errResult = err?.response?.data;
                this.logger.log(JSON.stringify(errResult));
                throw new BadRequestException(`네이버 프로필 조회 중 오류가 발생했습니다: ${errResult?.message}`);
            });
        this.logger.log(JSON.stringify(res?.data?.response));
        const { id, nickname, profile_image } = res?.data?.response;
        return {
            id,
            email: null,
            nickname,
            profileImageUrl: profile_image
        };
    }

    async fetchPlaces(dto: FetchNaverPlaceDTO) {
        const { address, display, keyword } = dto;

        const headers = new AxiosHeaders();
        headers.set('X-Naver-Client-Id', this.clientId);
        headers.set('X-Naver-Client-Secret', this.clientSecret);
        headers.setAccept('*/*');
        headers.set('Access-Control-Allow-Origin', '*');

        const params = new URLSearchParams();
        params.set('query', `${address} ${keyword}`);
        params.set('display', display.toString());
        params.set('sort', 'random');

        const res = await axios.get(`https://openapi.naver.com/v1/search/local.json`, {
            headers,
            params
        }).catch(err => {
            const errResult = err?.response?.data;
            this.logger.log(JSON.stringify(errResult));
            throw new BadRequestException(`네이버 장소 검색 중 오류가 발생했습니다: ${errResult?.errorMessage}`);
        });

        return res.data.items ?? [] as NaverPlaceViewModel[];
    }

    async fetchDrivePaths(dto: FetchNaverDrivePathDTO) {
        const headers = new AxiosHeaders();
        headers.set('X-NCP-APIGW-API-KEY-Id', this.cloudClientId);
        headers.set('X-NCP-APIGW-API-KEY', this.cloudClientSecret);

        const params = new URLSearchParams();
        params.set('start', `${dto.startLng},${dto.startLat}`);
        params.set('goal', `${dto.goalLng},${dto.goalLat}`);
        params.set('option', 'trafast');

        const res = await axios.get(`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving`, {
            headers,
            params
        }).catch(err => {
            const errResult = err?.response?.data;
            this.logger.log(JSON.stringify(errResult));
            throw new BadRequestException(`네이버 드라이브 경로 검색 중 오류가 발생했습니다: ${errResult?.errorMessage}`);
        });

        const { code, message: errMsg } = res.data;
        if (code !== 0) {
            throw new BadRequestException(`네이버 드라이브 경로 검색 중 오류가 발생했습니다: ${errMsg}`);
        }
  
        return res.data as NaverDrivePathsViewModel;
    }
}