import { BadRequestException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JusogoViewModel, NaverDrivePathsViewModel, NaverPlaceViewModel } from "../core/models";
import { FcmNotifyDTO, FetchNaverDrivePathDTO, FetchNaverPlaceDTO } from "../dto";
import { FirebaseService, JusogoService, NaverService } from "../services";

@Controller({ path: 'third-party-services', version: '1' })
@ApiTags('서드파티서비스제공')
export class ThirdPartyServiceController {

    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly naverService: NaverService,
        private readonly jusugoService: JusogoService,
    ) { }
    
    @Post('fcm/notify')
    @ApiOperation({ summary: 'FCM푸시알림' })
    @ApiResponse({ type: [NaverPlaceViewModel] })
    async fmcNotify(@Body() dto: FcmNotifyDTO) {
        return await this.firebaseService.notify(dto);
    }

    @Get('naver/places')
    @ApiOperation({ summary: '네이버장소검색' })
    @ApiResponse({ type: [NaverPlaceViewModel] })
    async fetchNaverPlaces(@Query() dto: FetchNaverPlaceDTO) {
        return await this.naverService.fetchPlaces(dto);
    }

    @Get('naver/drive-paths')
    @ApiOperation({ summary: '네이버드라이브경로검색' })
    @ApiResponse({ type: NaverDrivePathsViewModel })
    async fetchNaverDrivePaths(@Query() dto: FetchNaverDrivePathDTO) {
        return await this.naverService.fetchDrivePaths(dto);
    }

    @Get('address/search')
    @ApiOperation({ summary: '주소검색(주소기반산업지원서비스제공)' })
    @ApiResponse({ type: [JusogoViewModel] })
    async searchAddress(@Query('keyword') keyword: string) {
        if (!keyword) throw new BadRequestException('검색어를 입력해주세요.');
        return await this.jusugoService.search(keyword);
    }
}