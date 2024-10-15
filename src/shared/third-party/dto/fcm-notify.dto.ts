import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";

export class FcmNotifyMetaData {
    @IsNotEmpty()
    @ApiProperty()
    readonly type: string;

    @IsOptional()
    @ApiProperty()
    readonly id?: string;
}

export class FcmNotifyDTO {
    @IsOptional()
    @ApiProperty()
    readonly fcmTokens: string[];

    @IsNotEmpty()
    @ApiProperty()
    readonly title: string;

    @IsNotEmpty()
    @ApiProperty()
    readonly content: string;

    @IsOptional()
    @ApiProperty()
    readonly iconUrl: string;

    @ValidateNested()
    @IsNotEmpty()
    @ApiProperty({ type: FcmNotifyMetaData })
    readonly meta: FcmNotifyMetaData;
}