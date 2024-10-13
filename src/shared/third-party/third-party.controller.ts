import { Controller, Get, Query, Render, Res, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { EnvConfig } from "src/shared/config";
import { AuthorizedResult } from "./interfaces";
import { GoogleService, KakaoService, NaverService } from "./services";

@Controller({ path: 'third-parties', version: '1' })
@ApiTags('서드파티인증')
export class ThirdPartyController {

    constructor(
        private readonly configService: ConfigService<EnvConfig>,
        private readonly kakaoService: KakaoService,
        private readonly naverService: NaverService,
        private readonly googleService: GoogleService
    ) { }

    @Get('kakao/login')
    @ApiOperation({ summary: '카카오로그인페이지로이동' })
    async kakaoLogin(@Res() res: Response) {
        return res.redirect(this.kakaoService.getLoginUrl());
    }

    @Get('kakao/authorize')
    @ApiOperation({ summary: '카카오로그인->인증코드로토큰발급' })
    @Render('social-auth-result')
    async kakaoAuthorize(@Query('code') code: string): Promise<AuthorizedResult> {
        if (!code) throw new UnauthorizedException('허가되지 않은 접근입니다.');
        return await this.kakaoService.authorize(code);
    }

    @Get('naver/login')
    @ApiOperation({ summary: '네이버로그인페이지로이동' })
    async naverLogin(@Res() res: Response) {
        return res.redirect(this.naverService.getLoginUrl());
    }

    @Get('naver/authorize')
    @ApiOperation({ summary: '네이버로그인->인증코드로토큰발급' })
    @Render('social-auth-result') // EJS 템플릿을 렌더링
    async naverAuthorize(@Query('code') code: string): Promise<AuthorizedResult> {
        if (!code) throw new UnauthorizedException('허가되지 않은 접근입니다.');
        return await this.naverService.authorize(code);
    }

    @Get('google/login')
    @ApiOperation({ summary: '구글로그인페이지로이동' })
    async googleLogin(@Res() res: Response) {
        return res.redirect(this.googleService.getLoginUrl());
    }

    @Get('google/authorize')
    @ApiOperation({ summary: '구글로그인->인증코드로토큰발급' })
    @Render('social-auth-result') // EJS 템플릿을 렌더링
    async googleAuthorize(@Query('code') code: string): Promise<AuthorizedResult> {
        if (!code) throw new UnauthorizedException('인증 코드가 제공되지 않았습니다.');
        return await this.googleService.authorize(code);
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