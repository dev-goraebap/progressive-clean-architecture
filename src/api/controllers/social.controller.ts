import { Controller, Get, Query, Render, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import axios from "axios";
import { randomBytes } from "crypto";
import { Response } from "express";
import { EnvConfig } from "src/shared/config";

@Controller({ path: 'socials', version: '1' })
@ApiTags('소셜정보')
export class SocialController {

    constructor(
        private readonly configService: ConfigService<EnvConfig>
    ) { }

    @Get('kakao/login')
    @ApiOperation({ summary: '카카오로그인페이지로이동' })
    async kakaoLogin(@Res() res: Response) {
        const clientId = this.configService.get<string>('KAKAO_CLIENT_ID');
        const redirectUri = this.configService.get<string>('KAKAO_REDIRECT_URI');
        return res.redirect(
            `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
        );
    }

    @Get('kakao/authenticate')
    @ApiOperation({ summary: '카카오로그인->인증코드로토큰발급' })
    @Render('social-auth-result')
    async kakaoAuthenticate(@Query('code') code: string) {
        if (!code) throw new UnauthorizedException('허가되지 않은 접근입니다.');
        let accessToken = '';
        try {
            const res = await axios.post('https://kauth.kakao.com/oauth/token', {
                grant_type: 'authorization_code',
                client_id: this.configService.get('KAKAO_CLIENT_ID'),
                redirect_uri: this.configService.get('KAKAO_REDIRECT_URI'),
                code: code,
            }, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            accessToken = res.data?.access_token;
        } catch (err) {
            console.error(err);
            return { provider: 'K', token: null, errMsg: '카카오인증요청에 실패하였습니다.' };
        }

        return { provider: 'K', token: accessToken, errMsg: null };
    }

    @Get('naver/login')
    @ApiOperation({ summary: '네이버로그인페이지로이동' })
    async naverLogin(@Res() res: Response) {
        const clientId = this.configService.get('NAVER_CLIENT_ID');
        const redirectUri = encodeURIComponent(this.configService.get('NAVER_REDIRECT_URI'));
        let url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code';
        const state = randomBytes(16).toString('hex');
        url += `&client_id=${clientId}`;
        url += `&redirect_uri=${redirectUri}`;
        url += `&state=${state}`;
        return res.redirect(url);
    }

    @Get('naver/authenticate')
    @ApiOperation({ summary: '네이버로그인->인증코드로토큰발급' })
    @Render('social-auth-result') // EJS 템플릿을 렌더링
    async naverAuthenticate(@Query('code') code: string, @Query('state') state: string) {
        if (!code || !state) throw new UnauthorizedException('허가되지 않은 접근입니다.');

        const clientId = this.configService.get('NAVER_CLIENT_ID'); // 네이버에서 발급받은 클라이언트 ID
        const clientSecret = this.configService.get('NAVER_CLIENT_SECRET'); // 네이버에서 발급받은 클라이언트 시크릿 값
        const redirectUri = encodeURIComponent(this.configService.get('NAVER_REDIRECT_URI')); // 설정한 리다이렉트 URI

        let apiURL = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code';
        apiURL += `&client_id=${clientId}`;
        apiURL += `&client_secret=${clientSecret}`;
        apiURL += `&redirect_uri=${redirectUri}`;
        apiURL += `&code=${code}`;
        apiURL += `&state=${state}`;

        try {
            // 네이버 API로 요청 전송
            const response = await axios.post(apiURL, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token, refresh_token } = response.data;
            return { provider: 'N', token: access_token, errMsg: null };
        } catch (error) {
            return { provider: 'N', token: null, errMsg: '네이버 인증 중 오류가 발생했습니다.' };
        }
    }

    @Get('google/login')
    @ApiOperation({ summary: '구글로그인페이지로이동' })
    async googleLogin(@Res() res: Response) {
        const clientId = this.configService.get('GOOGLE_CLIENT_ID');
        const redirectUri = encodeURIComponent(this.configService.get('GOOGLE_REDIRECT_URI'));
        const state = 'RANDOM_STATE';
        const scope = encodeURIComponent('email profile');
        const responseType = 'code';
        const accessType = 'offline';
        let url = 'https://accounts.google.com/o/oauth2/v2/auth?';
        url += `client_id=${clientId}`;
        url += `&redirect_uri=${redirectUri}`;
        url += `&response_type=${responseType}`;
        url += `&scope=${scope}`;
        url += `&state=${state}`;
        url += `&access_type=${accessType}`;
        return res.redirect(url);
    }

    @Get('google/authenticate')
    @ApiOperation({ summary: '구글로그인->인증코드로토큰발급' })
    @Render('social-auth-result') // EJS 템플릿을 렌더링
    async googleAuthenticate(@Query('code') code: string) {
        if (!code) {
            throw new UnauthorizedException('인증 코드가 제공되지 않았습니다.');
        }

        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const grantType = 'authorization_code';

        try {
            const params = new URLSearchParams();
            params.append('code', code);
            params.append('client_id', this.configService.get('GOOGLE_CLIENT_ID'));
            params.append('client_secret', this.configService.get('GOOGLE_CLIENT_SECRET'));
            params.append('redirect_uri', this.configService.get('GOOGLE_REDIRECT_URI'));
            params.append('grant_type', grantType);

            // 구글에 토큰 요청
            const response = await axios.post(tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token, refresh_token, expires_in } = response.data;
            return { provider: 'G', token: access_token, errMsg: null };
        } catch (error) {
            console.error('토큰 발급 실패:', error);
            return { provider: 'G', token: null, errMsg: '구글 인증 중 오류가 발생했습니다.' };
        }
    }

    @Get('apple/login')
    @ApiOperation({ summary: '애플로그인페이지로이동' })
    async appleLogin(@Res() res: Response) {
        const clientId = this.configService.get('APPLE_CLIENT_ID');
        const redirectUri = encodeURIComponent(this.configService.get('APPLE_REDIRECT_URI'));
        let scope = 'email name edu.users.read edu.classes.read';  // 요청할 스코프
        scope = encodeURIComponent(scope);  // 퍼센트 인코딩 처리
        const responseType = 'code';
        let url = 'https://appleid.apple.com/auth/authorize';
        url += `?client_id=${clientId}`;
        url += `&redirect_uri=${redirectUri}`;
        url += `&response_type=${responseType}`;
        return res.redirect(url);
    }
}