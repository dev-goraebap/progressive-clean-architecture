import { ApiProperty } from "@nestjs/swagger";

export class NaverPlaceViewModel {
    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly link: string;

    @ApiProperty()
    readonly category: string;

    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly telephone: string;

    @ApiProperty()
    readonly address: string;

    @ApiProperty()
    readonly roadAddress: string;

    @ApiProperty()
    readonly mapx: string;

    @ApiProperty()
    readonly mapy: string;
}