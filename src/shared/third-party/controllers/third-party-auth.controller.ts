import { BadRequestException, Controller, Get, Query, Render, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { OAuthAuthorizedViewModel, OAuthProfileViewModel } from "../core/models";
import { OAuthProviders } from "../core/types";
import { AppleService, GoogleService, KakaoService, NaverService } from "../services";

@Controller({ path: 'third-parties', version: '1' })
@ApiTags('서드파티인증')
export class ThirdPartyAuthController {

    constructor(
        private readonly kakaoService: KakaoService,
        private readonly naverService: NaverService,
        private readonly googleService: GoogleService,
        private readonly appleService: AppleService
    ) { }
    
    @Get('kakao/login')
    @ApiOperation({ summary: '카카오로그인페이지로이동' })
    async kakaoLogin(@Res() res: Response) {
        return res.redirect(this.kakaoService.oauthGetLoginUrl());
    }

    @Get('kakao/authorize')
    @ApiOperation({ summary: '카카오로그인->인증코드로토큰발급' })
    @Render('third-party/login-result')
    async kakaoAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedViewModel> {
        if (!code) {
            return {
                provider: OAuthProviders.KAKAO,
                accessToken: null,
                idToken: null,
                expiresAt: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.kakaoService.oauthAuthorize(code);
    }

    @Get('kakao/profile')
    @ApiOperation({ summary: '카카오인증토큰으로프로필조회' })
    @ApiResponse({ type: OAuthProfileViewModel })
    async getKakaoProfile(@Query('token') token: string) {
        if (!token) throw new BadRequestException('인증 토큰이 제공되지 않았습니다.');
        return await this.kakaoService.oauthGetProfile(token);
    }

    @Get('naver/login')
    @ApiOperation({ summary: '네이버로그인페이지로이동' })
    async naverLogin(@Res() res: Response) {
        return res.redirect(this.naverService.oauthGetLoginUrl());
    }

    @Get('naver/authorize')
    @ApiOperation({ summary: '네이버로그인->인증코드로토큰발급' })
    @Render('third-party/login-result')
    async naverAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedViewModel> {
        if (!code) {
            return {
                provider: OAuthProviders.NAVER,
                accessToken: null,
                idToken: null,
                expiresAt: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.naverService.oauthAuthorize(code);
    }

    @Get('naver/profile')
    @ApiOperation({ summary: '네이버인증토큰으로프로필조회' })
    @ApiResponse({ type: OAuthProfileViewModel })
    async getNaverProfile(@Query('token') token: string) {
        if (!token) throw new BadRequestException('인증 토큰이 제공되지 않았습니다.');
        return await this.naverService.oauthGetProfile(token);
    }

    @Get('google/login')
    @ApiOperation({ summary: '구글로그인페이지로이동' })
    async googleLogin(@Res() res: Response) {
        return res.redirect(this.googleService.oauthGetLoginUrl());
    }

    @Get('google/authorize')
    @ApiOperation({ summary: '구글로그인->인증코드로토큰발급' })
    @Render('third-party/login-result')
    async googleAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedViewModel> {
        if (!code) {
            return {
                provider: OAuthProviders.GOOGLE,
                accessToken: null,
                idToken: null,
                expiresAt: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.googleService.oauthAuthorize(code);
    }

    @Get('google/profile')
    @ApiOperation({ summary: '구글인증토큰으로프로필조회' })
    @ApiResponse({ type: OAuthProfileViewModel })
    async getGoogleProfile(@Query('token') token: string) {
        if (!token) throw new BadRequestException('인증 토큰이 제공되지 않았습니다.');
        return await this.googleService.oauthGetProfile(token);
    }

    @Get('apple/login')
    @ApiOperation({ summary: '애플로그인페이지로이동' })
    async appleLogin(@Res() res: Response) {
        return res.redirect(this.appleService.oauthGetLoginUrl());
    }

    @Get('apple/authorize')
    @ApiOperation({ summary: '애플로그인->인증코드로토큰발급' })
    @Render('third-party/login-result')
    async appleAuthorize(@Query('code') code: string): Promise<OAuthAuthorizedViewModel> {
        if (!code) {
            return {
                provider: OAuthProviders.APPLE,
                accessToken: null,
                idToken: null,
                expiresAt: null,
                errMsg: '인증 코드가 제공되지 않았습니다.'
            }
        }
        return await this.appleService.oauthAuthorize(code);
    }

    @Get('apple/profile')
    @ApiOperation({ summary: '애플인증토큰으로프로필조회' })
    @ApiResponse({ type: OAuthProfileViewModel })
    async getAppleProfile(@Query('token') token: string) {
        if (!token) throw new BadRequestException('인증 토큰이 제공되지 않았습니다.');
        return this.appleService.oauthGetProfile(token);
    }
}