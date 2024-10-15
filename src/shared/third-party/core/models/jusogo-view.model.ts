import { ApiProperty } from "@nestjs/swagger";

export class JSGRCommon {
    @ApiProperty()
    readonly errorMessage: string;

    @ApiProperty()
    readonly countPerPage: string;

    @ApiProperty()
    readonly totalCount: string;

    @ApiProperty()
    readonly errorCode: string;

    @ApiProperty()
    readonly currentPage: string;
}

export class JSGRJuso {
    @ApiProperty()
    readonly detBdNmList: string;

    @ApiProperty()
    readonly engAddr: string;

    @ApiProperty()
    readonly rn: string;

    @ApiProperty()
    readonly emdNm: string;

    @ApiProperty()
    readonly zipNo: string;

    @ApiProperty()
    readonly roadAddrPart2: string;

    @ApiProperty()
    readonly emdNo: string;

    @ApiProperty()
    readonly sggNm: string;

    @ApiProperty()
    readonly jibunAddr: string;

    @ApiProperty()
    readonly siNm: string;

    @ApiProperty()
    readonly roadAddrPart1: string;

    @ApiProperty()
    readonly bdNm: string;

    @ApiProperty()
    readonly admCd: string;

    @ApiProperty()
    readonly udrtYn: string;

    @ApiProperty()
    readonly lnbrMnnm: string;

    @ApiProperty()
    readonly roadAddr: string;

    @ApiProperty()
    readonly lnbrSlno: string;

    @ApiProperty()
    readonly buldMnnm: string;

    @ApiProperty()
    readonly bdKdcd: string;

    @ApiProperty()
    readonly liNm: string;

    @ApiProperty()
    readonly rnMgtSn: string;

    @ApiProperty()
    readonly mtYn: string;

    @ApiProperty()
    readonly bdMgtSn: string;

    @ApiProperty()
    readonly buldSlno: string;
}

export class JusogoResults {
    @ApiProperty({ type: JSGRCommon })
    readonly common: JSGRCommon;

    @ApiProperty({ type: [JSGRJuso] })
    readonly juso: JSGRJuso[];
}

export class JusogoViewModel {
    @ApiProperty({ type: JusogoResults })
    readonly results: JusogoResults;
}