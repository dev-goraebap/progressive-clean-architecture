import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString } from "class-validator";

export class FetchNaverDrivePathDTO {
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ default: '35.1601037626662' })
    readonly startLat: string;

    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ default: '126.851629955742' })
    readonly startLng: string;

    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ default: '35.0158976865702' })
    readonly goalLat: string;

    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty({ default: '126.71082925505' })
    readonly goalLng: string;
}