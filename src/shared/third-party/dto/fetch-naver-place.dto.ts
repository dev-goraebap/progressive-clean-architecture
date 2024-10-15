import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FetchNaverPlaceDTO {
    @IsNotEmpty()
    @ApiProperty()
    readonly address: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly keyword: string;

    @IsOptional()
    @ApiProperty({ required: false })
    readonly display: number = 50;
}