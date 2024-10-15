import { ApiProperty } from "@nestjs/swagger";

export class FcmResponse {
    @ApiProperty()
    readonly success: boolean;

    @ApiProperty()
    readonly messageId: string;
}

export class FcmResultViewModel {
    @ApiProperty()
    readonly successCount: number;

    @ApiProperty()
    readonly failureCount: number;

    @ApiProperty({ type: [FcmResponse] })
    readonly responses: FcmResponse[];
}